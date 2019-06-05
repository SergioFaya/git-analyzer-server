"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RepoSchema_1 = require("../../../schemas/RepoSchema");
const SyncRepoService = {
    sync: (repo) => {
        const r = new RepoSchema_1.RepoModel(repo);
        r.save();
    },
};
exports.default = SyncRepoService;
//# sourceMappingURL=SyncRepoServiceImpl.js.map