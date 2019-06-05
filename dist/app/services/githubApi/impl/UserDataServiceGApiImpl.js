"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
}
Object.defineProperty(exports, "__esModule", { value: true });
const superagent = __importStar(require("superagent"));
const Logger_1 = require("../../../../logger/Logger");
const userDataService = {
    getUserDataByToken: (token) => {
        return getUserDataByTokenPromise(token)
            .catch((err) => {
            Logger_1.errorLogger(`Cannot get data from user with token ${token}`, err);
            return null;
        })
            .then((result) => createUser(result.body));
    },
    getUserPrimaryEmailByToken: (token) => {
        return getUserEmailsByTokenPromise(token)
            .catch((err) => {
            Logger_1.errorLogger(`Cannot get emails from user with token ${token}`, err);
            return null;
        })
            .then((result) => {
            const email = result.body.find((x) => {
                return x.primary;
            }).email;
            return email;
        });
    },
};
exports.default = userDataService;
const getUserDataByTokenPromise = (token) => {
    return superagent
        .get('https://api.github.com/user')
        .set('Authorization', `token ${token}`)
        .set('Accept', 'application/json');
};
const getUserEmailsByTokenPromise = (token) => {
    return superagent
        .get('https://api.github.com/user/emails')
        .set('Authorization', `token ${token}`)
        .set('Accept', 'application/json');
};
const createUser = (body) => {
    const { id, login, name, type, avatar_url } = body;
    const user = {
        email: undefined,
        id,
        imageUrl: avatar_url,
        login,
        name,
        type,
        username: login,
    };
    return user;
};
//# sourceMappingURL=UserDataServiceGApiImpl.js.map