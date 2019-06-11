"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
exports.errorLogger = (message, trace = undefined) => {
    exports.logger.log({
        date: Date.now().toString(),
        level: 'error',
        message,
        trace,
    });
};
exports.infoLogger = (message) => {
    exports.logger.log({
        date: Date.now().toString(),
        level: 'info',
        message,
    });
};
var LogLevel;
(function (LogLevel) {
    LogLevel["error"] = "error";
    LogLevel["info"] = "info";
})(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
exports.logger = winston_1.default.createLogger({
    format: winston_1.default.format.combine(winston_1.default.format.json(), winston_1.default.format.colorize()),
    levels: winston_1.default.config.syslog.levels,
    transports: [
        new winston_1.default.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston_1.default.transports.Console({
            format: winston_1.default.format.combine(winston_1.default.format.simple(), winston_1.default.format.colorize()),
            level: 'info',
        }),
        new winston_1.default.transports.File({ filename: 'logs/info.log', level: 'info' }),
    ],
});
//# sourceMappingURL=Logger.js.map