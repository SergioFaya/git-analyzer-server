
import { Repo, RepoModel } from '../../../schemas/RepoSchema';
import SyncRepoService from '../SyncRepoService';

const SyncRepoService: SyncRepoService = {
	sync: (repo: Repo): void => {
		const r = new RepoModel(repo);
		r.save();
	},
};

export default SyncRepoService;