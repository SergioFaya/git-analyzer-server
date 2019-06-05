"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const fs = __importStar(require("fs"));
const git_analyzer_types_1 = require("git-analyzer-types");
const simple_git_1 = __importDefault(require("simple-git"));
const promise_1 = __importDefault(require("simple-git/promise"));
const Config_1 = require("../../../../config/impl/Config");
const Logger_1 = require("../../../../logger/Logger");
const networkChartService = {
    getNetworkChartData: (token, username, reponame) => {
        const URL = `github.com/${reponame}`;
        const repository = `https://${username}:${token}@${URL}`;
        var options = Config_1.config.app.chartsConfig.logOptions;
        var path = Config_1.config.app.repositoryFilesPath + reponame;
        if (fs.existsSync(path)) {
            return promise_1.default(path)
                .pull(repository)
                .then(() => __awaiter(this, void 0, void 0, function* () {
                return yield callFormatLogsAsync(path, options);
            }))
                .then((result) => {
                return result;
            })
                .catch((err) => {
                Logger_1.errorLogger(`Cannot pull repo:${repository} with simple-git`, err);
            });
        }
        else {
            return promise_1.default().silent(false)
                .clone(repository, path)
                .then(() => __awaiter(this, void 0, void 0, function* () {
                return yield callFormatLogsAsync(reponame, options);
            }))
                .then((result) => {
                return result;
            })
                .catch((err) => {
                Logger_1.errorLogger(`Cannot clone repo:${repository} with simple-git`, err);
            });
        }
    }
};
function callFormatLogsAsync(reponame, options) {
    return __awaiter(this, void 0, void 0, function* () {
        var result;
        yield simple_git_1.default(`${reponame}`)
            .log(options, (err, log) => __awaiter(this, void 0, void 0, function* () {
            if (err) {
                console.log(err);
            }
            else {
                var line = log.all[0].hash;
                result = yield formatLogs(line);
            }
        }));
        return result;
    });
}
var commitsList = Array();
var e = 15;
var d = 0;
var s = Object.create(null);
var a = 9;
function inspectNode(n) {
    return __awaiter(this, void 0, void 0, function* () {
        var i = n;
        var h = commitsList;
        if (!n.isPlumbed) {
            var u = void 0;
            if (n.parents && n.parents.length > 0) {
                for (var r = 0; r < n.parents.length; r++) {
                    var l = s[n.parents[r]];
                    if (l && !l.isPlumbed) {
                        0 == r ? u = yield inspectNode(l) : yield inspectNode(l);
                        var m = l.col - n.col;
                        var v = l.row - n.row;
                        if (0 === m && (m = r), m >= 0) {
                            var b = n.col + m;
                        }
                        else {
                            b = n.col;
                        }
                        for (var f = 1; v > f; f++) {
                            var c = h[n.row + f];
                            c && !c.isPlumbed && (c.col = b + 1, c.x = a + e * c.col, d = Math.max(c.col, d));
                        }
                    }
                    else {
                        0 == r && (u = i);
                    }
                }
            }
            else {
                u = i;
            }
            ;
        }
        return n.isPlumbed = !0, u;
    });
}
function filterTagsAndBranches(info) {
    return __awaiter(this, void 0, void 0, function* () {
        function sortResult(t) {
            return t.sort().filter((element, index, arrayRef) => {
                return !index || element != arrayRef[index - 1];
            });
        }
        info = info.trim();
        if ("(" === info.charAt(0) && ")" === info.charAt(info.length - 1)) {
            info = info.substr(0, info.length - 1);
        }
        var tags = [];
        var branches = [];
        var infoSplitted = info.split(", ");
        for (let i = 0; i < infoSplitted.length; i++) {
            var infoLine = infoSplitted[i];
            var tagSeparator = "tag: ";
            if (0 == infoLine.indexOf(tagSeparator.length)) {
                tags.push(infoLine.substr(5));
            }
            else {
                infoLine.indexOf("refs/pull-requests/") >= 0 || branches.push(infoLine);
            }
        }
        return [sortResult(tags), sortResult(branches)];
    });
}
function formatLogs(data) {
    return __awaiter(this, void 0, void 0, function* () {
        var formatedCommits = commitsList;
        var logLines = data.trim().split("\n");
        for (var i = 0; i < logLines.length; i++) {
            var line = logLines[i];
            if ("" !== line.trim()) {
                line = line.split("|");
                var shaNode = line[0];
                var parents = line[1];
                var object = {
                    isPlumbed: !1,
                    sha1: shaNode,
                    row: formatedCommits.length,
                    col: 0,
                    parents: undefined,
                    tags: undefined,
                    branches: undefined
                };
                formatedCommits.push(object);
                s[object.sha1] = object;
                if (parents) {
                    object.parents = line[1].split(" ");
                    var extraInfo = line[2];
                    if (extraInfo && "" !== extraInfo.trim()) {
                        var g = yield filterTagsAndBranches(extraInfo.trim());
                        object.tags = g[0];
                        object.branches = g[1];
                    }
                }
                object.committer = line[3];
            }
        }
        for (let commit = formatedCommits[0], i = 0; i < (commit ? commit.row : formatedCommits.length); i++) {
            object = formatedCommits[i];
            object.col++;
        }
        for (i = 0; i < formatedCommits.length; i++) {
            yield inspectNode(formatedCommits[i]);
        }
        var formatedEdges = [];
        var formatedNodes = [];
        let height = 0;
        ({ formatedNodes, height } = yield createNodes(formatedNodes, formatedCommits, height));
        formatedEdges = yield createEdges(formatedCommits);
        commitsList = Array();
        const networkChart = {
            nodes: formatedNodes,
            edges: formatedEdges,
            height,
            toolTips: [],
        };
        return networkChart;
    });
}
function createNodes(formatedNodes, formatedCommits, height) {
    return __awaiter(this, void 0, void 0, function* () {
        formatedNodes = yield formatedCommits.map((iterator) => {
            height += iterator.row * 2;
            const node = {
                x: iterator.col * 4,
                y: iterator.row * 2,
                id: iterator.sha1,
                size: 10,
                color: '#008cc2',
                parents: iterator.parents,
            };
            return node;
        });
        return { formatedNodes, height };
    });
}
function createEdges(formatedCommits) {
    return __awaiter(this, void 0, void 0, function* () {
        var formatedEdges = [];
        yield formatedCommits.forEach((iterator) => {
            if (iterator.parents && iterator.parents.length >= 1) {
                iterator.parents.forEach((y) => {
                    var targetValue = y;
                    const edge = {
                        id: 'edge' + iterator.sha1 + '-' + y,
                        label: 'Edge ',
                        source: targetValue,
                        target: iterator.sha1,
                        size: 5,
                        color: '#fffff',
                        type: git_analyzer_types_1.EdgeType.ARROW
                    };
                    formatedEdges.push(edge);
                });
            }
        });
        return formatedEdges;
    });
}
exports.default = networkChartService;
//# sourceMappingURL=NetworkChartServiceImpl.js.map