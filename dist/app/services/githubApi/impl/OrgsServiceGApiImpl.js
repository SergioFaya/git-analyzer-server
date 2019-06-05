"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const superagent_1 = __importDefault(require("superagent"));
const orgService = {
    getOrganizationsUserParticipatesIn: (token) => {
        return getOrganizationsUserParticipatesInPromise(token)
            .then((result) => {
            return result;
        });
    },
    getOwnedOrganizations: (token, username) => {
        return getOwnedOrganizationsPromise(token, username)
            .then((result) => {
            return result;
        });
    },
};
const getOrganizationsUserParticipatesInPromise = (token) => {
    return superagent_1.default.get(`https://api.github.com/user/orgs`)
        .set('Accept', 'application/json')
        .set('x-access-token', token);
};
const getOwnedOrganizationsPromise = (token, username) => {
    return superagent_1.default.get(`https://api.github.com/users/${username}/orgs`)
        .set('Accept', 'application/json')
        .set('x-access-token', token);
};
exports.default = orgService;
//# sourceMappingURL=OrgsServiceGApiImpl.js.map