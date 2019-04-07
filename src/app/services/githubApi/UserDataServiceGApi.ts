import UserData from '../../models/UserData';

export default interface UserDataService {
	getUserPrimaryEmailByToken(token: string): Promise<string>;
	getUserDataByToken(token: string): Promise<UserData>;
}
