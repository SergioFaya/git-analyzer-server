"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const IssueWHEventSchema_1 = require("../../schemas/IssueWHEventSchema");
const WebHookServiceImpl_1 = __importDefault(require("../../services/business/impl/WebHookServiceImpl"));
const router = express_1.Router();
router.post('/hooks', (req, _res) => {
    var event = req.header('X-GitHub-Event');
    if (event === 'issues') {
        var issue = req.body.issue;
        var repo = req.body.repository;
        WebHookServiceImpl_1.default.saveIssuesEvent(new IssueWHEventSchema_1.IssueWHEvent(issue, Date.now(), repo));
    }
});
exports.default = router;
//# sourceMappingURL=WebHooksRouter.js.map