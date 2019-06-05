"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = require("../../../../logger/Logger");
const CodeReviewSchema_1 = require("../../../schemas/CodeReviewSchema");
const CodeReviewService = {
    getAllCodeReviews: () => __awaiter(this, void 0, void 0, function* () {
        var reviews = [];
        yield CodeReviewSchema_1.CodeReviewModel.find((err, res) => {
            if (err) {
                Logger_1.errorLogger('Cannot get all code reviews', err);
                throw err;
            }
            else {
                reviews = res;
            }
        });
        return reviews;
    }),
    updateCodeReview: (_id) => {
    },
    createNewCodeReview: (codeReview) => {
        var cr = new CodeReviewSchema_1.CodeReviewModel(codeReview);
        cr.save();
    },
    deleteCodeReview: (_id) => {
    },
};
exports.default = CodeReviewService;
//# sourceMappingURL=CodeReviewServiceImpl.js.map