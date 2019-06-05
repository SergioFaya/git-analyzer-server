"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const superagent_1 = __importDefault(require("superagent"));
const Config_1 = require("../../../../config/impl/Config");
const CHECK_LOGIN_URL = '/login/check';
const authService = {
    auth: (token) => {
        return superagent_1.default
            .get(Config_1.config.services.auth.baseUrl + CHECK_LOGIN_URL)
            .set('Accept', 'application/json')
            .set('x-access-token', token);
    },
};
exports.default = authService;
//# sourceMappingURL=AuthServiceGApiImpl.js.map