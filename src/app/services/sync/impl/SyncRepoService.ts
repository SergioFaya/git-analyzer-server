import { errorLogger } from '../../../../logger/Logger';
import { Repo, RepoModel } from '../../../schemas/RepoSchema';
import ISyncService from '../SyncService';

const SyncRepoService: ISyncService<Repo> = {
	sync: (repo: Repo): void => {
		RepoModel.findOneAndUpdate({ id: repo.id }, { $set: repo }, (err, product) => {
			if (err) {
				errorLogger("Cannot sync repo, " + repo, err);
			} else {
				if (product === undefined || product === null) {
					const r = new RepoModel(repo);
					r.save();
				}
			}
		});
	},
};

export default SyncRepoService;