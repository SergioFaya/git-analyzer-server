"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Logger_1 = require("../../../logger/Logger");
const AuthServiceGApiImpl_1 = __importDefault(require("../../services/githubApi/impl/AuthServiceGApiImpl"));
const router = express_1.Router();
const ERROR_IN_SERVER = {
    message: 'Error in authentication server, try again later',
    success: false,
};
const ERROR_TOKEN_NOT_VALID = {
    message: 'Session token not valid, please login again',
    success: false,
};
const ERROR_NO_TOKEN = {
    message: 'No token provided, please login',
    success: false,
};
router.use((req, res, next) => {
    const token = req.headers['x-access-token'];
    if (token) {
        AuthServiceGApiImpl_1.default.auth(token)
            .then((result) => {
            const { success, expired } = result.body;
            if (success && !expired) {
                next();
            }
            else {
                Logger_1.errorLogger(`trying to access with a wrong token -> ${token}`);
                res.status(401).json(ERROR_TOKEN_NOT_VALID);
            }
        }).catch((err) => {
            Logger_1.errorLogger('cannot connect with authentication server', err);
            res.status(401).json(ERROR_IN_SERVER);
        });
    }
    else {
        res.status(401).json(ERROR_NO_TOKEN);
    }
});
exports.default = router;
//# sourceMappingURL=AuthenticactionMiddleware.js.map