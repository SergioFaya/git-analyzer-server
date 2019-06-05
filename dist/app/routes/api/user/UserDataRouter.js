"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Logger_1 = require("../../../../logger/Logger");
const UserDataServiceGApiImpl_1 = __importDefault(require("../../../services/githubApi/impl/UserDataServiceGApiImpl"));
const router = express_1.Router();
router.get('/user/info', (req, res) => {
    const token = req.headers['x-github-token'];
    const p1 = UserDataServiceGApiImpl_1.default.getUserPrimaryEmailByToken(token);
    const p2 = UserDataServiceGApiImpl_1.default.getUserDataByToken(token);
    Promise.all([p1, p2])
        .then((result) => {
        const email = result[0];
        const userData = result[1];
        userData.email = email;
        res.status(202).json(userData);
    }).catch((err) => {
        Logger_1.errorLogger('Could not get user info', err);
        res.status(500).json({
            message: "Cannot get user info"
        });
    });
});
exports.default = router;
//# sourceMappingURL=UserDataRouter.js.map