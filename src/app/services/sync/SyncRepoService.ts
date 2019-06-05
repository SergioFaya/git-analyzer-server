import { Repo } from '../../schemas/RepoSchema';

export default interface SyncRepoService {
	/**
	 * Fetches the data from the github api and stores it in the database
	 * @param reponame 
	 * @returns true if sync succeeded and false otherwise
	 */
	sync(repo: Repo): void;
}