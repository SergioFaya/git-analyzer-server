"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const superagent_1 = __importDefault(require("superagent"));
const Logger_1 = require("../../../../logger/Logger");
const ChartService = {
    getStatsOfUser: (token, reponame) => {
        const p1 = getContributorsByRepoName(token, reponame);
        const p2 = getStatsOfRepoAndContributors(token, reponame);
        return Promise.all([p1, p2])
            .then((result) => {
            return popullateStatsChartVM(result[0], result[1]);
        });
    },
};
const getContributorsByRepoNamePromise = (token, reponame) => {
    return superagent_1.default
        .get(`https://api.github.com/repos/${reponame}/contributors`)
        .set('Authorization', `token ${token}`);
};
const getStatsOfRepoAndContributorsPromise = (token, reponame) => {
    return superagent_1.default
        .get(`https://api.github.com/repos/${reponame}/stats/contributors`)
        .set('Authorization', `token ${token}`);
};
const getContributorsByRepoName = (token, reponame) => {
    return getContributorsByRepoNamePromise(token, reponame)
        .catch((err) => {
        Logger_1.errorLogger('Cant get access to the repository', err);
        return null;
    })
        .then((result) => {
        const contributorsGithub = result.body;
        const contributors = contributorsGithub.map((x) => {
            const user = {
                login: x.login,
                id: x.id,
                avatar_url: x.avatar_url,
                contributions: x.contributions,
                site_admin: x.site_admin,
            };
            return user;
        });
        return contributors;
    });
};
const getStatsOfRepoAndContributors = (token, reponame) => {
    return getStatsOfRepoAndContributorsPromise(token, reponame)
        .catch((err) => {
        Logger_1.errorLogger('Cannot get stats', err);
    })
        .then((result) => {
        const arr = result.body;
        return arr;
    });
};
function popullateStatsChartVM(final, arr) {
    return __awaiter(this, void 0, void 0, function* () {
        const total = Array();
        if (arr instanceof Array && final) {
            final.forEach((i) => {
                arr.forEach((j) => {
                    const statsReduced = j.weeks.reduce((anterior, actual) => {
                        return {
                            a: anterior.a + actual.a,
                            c: anterior.c + actual.c,
                            d: anterior.d + actual.d,
                        };
                    });
                    if (i.login === j.author.login) {
                        const contribution = {
                            avatar_url: i.avatar_url,
                            contributions: i.contributions,
                            login: i.login,
                            modifications: statsReduced,
                            total: j.total,
                        };
                        total.push(contribution);
                    }
                });
            });
            return total;
        }
        else {
            final.forEach((i) => {
                if (i.login) {
                    const contribution = {
                        avatar_url: i.avatar_url,
                        contributions: i.contributions,
                        login: i.login,
                        modifications: {
                            a: -1,
                            c: -1,
                            d: -1,
                        },
                        total: -1,
                    };
                    total.push(contribution);
                }
            });
            return total;
        }
    });
}
exports.default = ChartService;
//# sourceMappingURL=ChartServiceGApiImpl.js.map