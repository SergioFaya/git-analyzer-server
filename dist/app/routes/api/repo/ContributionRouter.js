"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Logger_1 = require("../../../../logger/Logger");
const ChartServiceGApiImpl_1 = __importDefault(require("../../../services/githubApi/impl/ChartServiceGApiImpl"));
const router = express_1.Router();
router.get('/contributors', (req, res) => {
    const token = req.header('x-github-token');
    const reponame = req.header('reponame');
    if (token && reponame) {
        ChartServiceGApiImpl_1.default.getStatsOfUser(token, reponame)
            .then((contributionsVM) => {
            res.status(202).json(contributionsVM);
        }).catch((err) => {
            Logger_1.errorLogger('Cannot get stats from contributors', err);
            res.status(404).json({
                message: 'Cannot get stats from contributors',
                success: false
            });
        });
    }
    else {
        Logger_1.errorLogger('cannot get username, token or reponame');
        res.status(404).json({
            message: 'Error: cannot get contributions',
            success: false,
        });
    }
});
exports.default = router;
//# sourceMappingURL=ContributionRouter.js.map