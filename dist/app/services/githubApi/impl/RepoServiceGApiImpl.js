"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const superagent_1 = __importDefault(require("superagent"));
const Logger_1 = require("../../../../logger/Logger");
const SyncRepoServiceImpl_1 = __importDefault(require("../../sync/impl/SyncRepoServiceImpl"));
const repoServiceGApi = {
    getAllRepos: (token) => {
        return getReposPromise(token)
            .catch((err) => {
            Logger_1.errorLogger(`Cannot get repos from user with token ${token}`, err);
            return Error;
        })
            .then((result) => createRepoArray(result.body));
    },
    getRepoByName: (token, reponame) => {
        return getRepoByNamePromise(token, reponame)
            .catch((err) => {
            Logger_1.errorLogger('Cannot get access to the repository', err);
            return null;
        }).then((result) => {
            const repo = createRepo(result.body);
            SyncRepoServiceImpl_1.default.sync(repo);
            return repo;
        });
    },
    getReposPaged: (token, page, per_page) => {
        return getReposPromise(token, page, per_page)
            .catch((err) => {
            Logger_1.errorLogger(`Cannot get data from user with token ${token}`, err);
            return Error;
        })
            .then((result) => createRepoArray(result.body));
    },
    getReposPagedBySearch: (token, page, per_page, search, username) => {
        return getSearchReposPromise(token, String(page), String(per_page), search, username)
            .catch((err) => {
            Logger_1.errorLogger(`Cannot get repos from user with token ${token}`, err);
            return Error;
        })
            .then((result) => createRepoArray(result.body.items));
    },
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
    const { id, node_id, name, full_name, html_url, description, url, forks_url, updated_at, homepage, size, has_issues, has_wiki, forks_count, forks, open_issues_count, open_issues, watchers, } = obj;
    return {
        id,
        node_id,
        name,
        full_name,
        html_url,
        description,
        url,
        updated_at,
        open_issues,
    };
};
const createRepoArray = (objs) => {
    const repos = objs.map((val) => {
        return createRepo(val);
    });
    return repos;
};
exports.default = repoServiceGApi;
//# sourceMappingURL=RepoServiceGApiImpl.js.map