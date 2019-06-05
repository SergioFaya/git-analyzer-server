"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Logger_1 = require("../../../../logger/Logger");
const RepoServiceGApiImpl_1 = __importDefault(require("../../../services/githubApi/impl/RepoServiceGApiImpl"));
const router = express_1.Router();
router.get('/repos', (req, res) => {
    const token = req.header('x-github-token');
    const page = req.query.page;
    const per_page = req.query.per_page;
    console.log(req.query);
    if (token) {
        RepoServiceGApiImpl_1.default.getReposPaged(token, page, per_page)
            .then((repos) => {
            res.status(202).json(repos);
        });
    }
    else {
        Logger_1.errorLogger('cannot get user token', req.body.err);
        res.status(404).json({
            message: 'Error: cannot get user repositories',
            success: false,
        });
    }
});
router.get('/repos/search', (req, res) => {
    const token = req.header('x-github-token');
    const { page, per_page, search, username } = req.query;
    console.log(req.query);
    if (token && username && search) {
        RepoServiceGApiImpl_1.default.getReposPagedBySearch(token, page, per_page, search, username)
            .then((repos) => {
            res.status(202).json(repos);
        });
    }
    else {
        Logger_1.errorLogger('cannot get user token', req.body.err);
        res.status(404).json({
            message: 'Error: cannot get user repositories',
            success: false,
        });
    }
});
router.get('/repos/reponame', (req, res) => {
    const token = req.header('x-github-token');
    const reponame = req.header('reponame');
    if (token && reponame) {
        RepoServiceGApiImpl_1.default.getRepoByName(token, reponame)
            .then((repo) => {
            res.status(202).json(repo);
        }).catch((err) => {
            Logger_1.errorLogger('Cannot get access to the repository', err);
            res.status(404).json({
                message: 'Cannot get access to the repository',
                success: false
            });
        });
    }
    else {
        Logger_1.errorLogger('Cannot get user repo');
        res.status(404).json({
            message: 'Cannot get user repo',
            success: false,
        });
    }
});
exports.default = router;
//# sourceMappingURL=RepoRouter.js.map