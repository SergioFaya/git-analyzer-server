
// // schena types
// const SyncCommitService: ISyncService<Commit> = {
// 	sync: (commit: ICommit): void => {
// 		const r = new CommitModel(commit);
// 		CommitModel.findOne({ id: commit.id }).then(found => {
// 			if (found) {
// 				r.update(commit);
// 			} else {
// 				r.save();
// 			}
// 		});
// 	},
// };

// export default SyncCommitService;