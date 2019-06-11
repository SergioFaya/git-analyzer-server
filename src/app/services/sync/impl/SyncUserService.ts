import { errorLogger } from '../../../../logger/Logger';
import { UserData, UserDataModel } from '../../../schemas/UserDataSchema';
import ISyncService from '../ISyncService';

const SyncUserDataService: ISyncService<UserData> = {
	sync: (user: UserData): void => {
		UserDataModel.findOneAndUpdate({ id: user.id }, { $set: user }, (err, product) => {
			if (err) {
				errorLogger("Cannot sync user data, " + user, err);
			} else {
				if (product === undefined || product === null) {
					const u = new UserDataModel(user);
					u.save();
				}
			}
		});
	},
};

export default SyncUserDataService;