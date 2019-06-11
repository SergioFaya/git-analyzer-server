"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const superagent_1 = __importDefault(require("superagent"));
const Logger_1 = require("../../../../logger/Logger");
const RepoSchema_1 = require("../../../schemas/RepoSchema");
const SyncRepoService_1 = __importDefault(require("../../sync/impl/SyncRepoService"));
const repoServiceGApi = {
    getAllRepos: (token) => {
        return getReposPromise(token)
            .catch((err) => {
            Logger_1.errorLogger(`Cannot get repos from user with token ${token}`, err);
            return Error;
        }).then((result) => {
            return createRepoArray(result.body);
        }).then((repos) => {
            repos.forEach((repo) => {
                SyncRepoService_1.default.sync(repo);
            });
            return repos;
        });
    },
    getRepoByName: (token, reponame) => {
        return getRepoByNamePromise(token, reponame)
            .catch((err) => {
            Logger_1.errorLogger('Cannot get access to the repository', err);
            return null;
        }).then((result) => {
            const repo = createRepo(result.body);
            SyncRepoService_1.default.sync(repo);
            return repo;
        });
    },
    getReposPaged: (token, page, per_page) => {
        return getReposPromise(token, page, per_page)
            .catch((err) => {
            Logger_1.errorLogger(`Cannot get data from user with token ${token}`, err);
            return Error;
        })
            .then((result) => {
            return createRepoArray(result.body);
        }).then((repos) => {
            repos.forEach((repo) => {
                SyncRepoService_1.default.sync(repo);
            });
            return repos;
        });
    },
    getReposPagedBySearch: (token, search, username) => __awaiter(this, void 0, void 0, function* () {
        return yield repoServiceGApi.getAllRepos(token)
            .then(() => __awaiter(this, void 0, void 0, function* () {
            const likeSearch = { $regex: ".*" + search + ".*" };
            const query = {
                full_name: likeSearch,
                "owner.login": username
            };
            let repoArray = [];
            yield RepoSchema_1.RepoModel.find(query)
                .then((repos) => {
                repoArray = createRepoArray(repos);
            });
            return repoArray;
        })).catch(err => {
            Logger_1.errorLogger("Cannot get all repos for search", err);
            return [];
        });
    }),
    getCommitOfRepo: (token, reponame, commitSha) => {
        return getCommitOfRepoPromise(token, reponame, commitSha)
            .then((result) => {
            var commit = result.body;
            return commit;
        }).catch((err) => {
            Logger_1.errorLogger('Cannot get commit of repo', err);
            return {};
        });
    }
};
const getCommitOfRepoPromise = (token, reponame, commitSha) => {
    return superagent_1.default
        .get(`https://api.github.com/repos/${reponame}/commits/${commitSha}`)
        .set('Authorization', `token ${token}`);
};
const getSearchReposPromise = (token, page, per_page, search, username) => {
    const searchQuery = `?q=in:name+${search}+user:${username}&page=${page}&per_page=${per_page}`;
    return superagent_1.default
        .get(`https://api.github.com/search/repositories${searchQuery}`)
        .set('Authorization', `token ${token}`);
};
const getReposPromise = (token, page, per_page) => {
    console.log(token);
    var query = { page, per_page };
    return superagent_1.default
        .get('http://api.github.com/user/repos')
        .query(query)
        .set('Authorization', `token ${token}`);
};
const getRepoByNamePromise = (token, reponame) => {
    return superagent_1.default
        .get(`http://api.github.com/repos/${reponame}`)
        .set('Authorization', `token ${token}`);
};
const createRepo = (obj) => {
    return obj;
};
const createRepoArray = (objs) => {
    const repos = objs.map((val) => {
        return createRepo(val);
    });
    return repos;
};
exports.default = repoServiceGApi;
//# sourceMappingURL=RepoServiceGApiImpl.js.map