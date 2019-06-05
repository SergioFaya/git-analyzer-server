"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Logger_1 = require("../../../../logger/Logger");
const NetworkChartServiceImpl_1 = __importDefault(require("../../../services/business/impl/NetworkChartServiceImpl"));
const router = express_1.Router();
router.get('/charts/gitTree', (req, res) => {
    const token = req.header('x-github-token');
    const reponame = req.header('reponame');
    const username = req.header('username');
    if (token && reponame) {
        NetworkChartServiceImpl_1.default.getNetworkChartData(token, username, reponame)
            .then((result) => {
            res.status(202).json(result);
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
//# sourceMappingURL=ChartsRouter.js.map