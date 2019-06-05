"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Logger_1 = require("../../../../logger/Logger");
const OrgsServiceGApiImpl_1 = __importDefault(require("../../../services/githubApi/impl/OrgsServiceGApiImpl"));
const router = express_1.Router();
router.get('/user/organizations', (req, res) => {
    const token = req.header('x-github-token');
    const username = req.query.username;
    OrgsServiceGApiImpl_1.default.getOwnedOrganizations(token, username)
        .then((_result) => {
        res.status(200).json();
    }).catch((_err) => {
        Logger_1.errorLogger('Could not get user info');
        res.status(500).json();
    });
});
exports.default = router;
//# sourceMappingURL=OrgsRouter.js.map