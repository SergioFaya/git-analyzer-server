"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const App_1 = __importDefault(require("./app/App"));
const ChartsRouter_1 = __importDefault(require("./app/routes/api/charts/ChartsRouter"));
const OrgsRouter_1 = __importDefault(require("./app/routes/api/orgs/OrgsRouter"));
const ContributionRouter_1 = __importDefault(require("./app/routes/api/repo/ContributionRouter"));
const RepoRouter_1 = __importDefault(require("./app/routes/api/repo/RepoRouter"));
const CodeReviewRouter_1 = __importDefault(require("./app/routes/api/review/CodeReviewRouter"));
const UserDataRouter_1 = __importDefault(require("./app/routes/api/user/UserDataRouter"));
const AuthenticactionMiddleware_1 = __importDefault(require("./app/routes/auth/AuthenticactionMiddleware"));
const WebHooksRouter_1 = __importDefault(require("./app/routes/hooks/WebHooksRouter"));
const Config_1 = require("./config/impl/Config");
const Logger_1 = require("./logger/Logger");
var path = require('path');
const globalAny = global;
globalAny.appRoot = path.resolve(__dirname);
App_1.default.use((_req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'POST, GET, DELETE, UPDATE, PUT');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, token');
    next();
});
const privateSites = [AuthenticactionMiddleware_1.default,
    WebHooksRouter_1.default,
    RepoRouter_1.default,
    UserDataRouter_1.default,
    ContributionRouter_1.default,
    OrgsRouter_1.default,
    ChartsRouter_1.default,
    CodeReviewRouter_1.default
];
privateSites.filter((router) => {
    App_1.default.use('/', router);
});
App_1.default.listen(Config_1.config.app.port, Config_1.config.app.source, () => {
    console.log('Express server listening on port ' + Config_1.config.app.port);
    Logger_1.logger.log({
        date: Date.now().toString(),
        level: 'info',
        message: 'Server started',
    });
});
//# sourceMappingURL=server.js.map