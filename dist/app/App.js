"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
}
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const bodyParser = __importStar(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const Config_1 = require("../config/impl/Config");
const Logger_1 = require("../logger/Logger");
class App {
    constructor() {
        this.app = express_1.default();
        this.config();
        this.dbSetUp();
    }
    config() {
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(bodyParser.json());
        this.app.use(cors_1.default());
    }
    dbSetUp() {
        mongoose_1.default.connect(Config_1.config.db.host, { useNewUrlParser: true }, (err) => {
            if (err) {
                Logger_1.logger.log({
                    date: Date.now().toString(),
                    level: 'error',
                    message: 'Unable to connect to database',
                });
                throw new Error('Db error: ' + err);
            }
        });
    }
}
exports.default = new App().app;
//# sourceMappingURL=App.js.map