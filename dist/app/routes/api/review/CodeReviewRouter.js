"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const CodeReviewServiceImpl_1 = __importDefault(require("../../../services/business/impl/CodeReviewServiceImpl"));
const router = express_1.Router();
router.get('/codeReview/list', (_req, res) => {
    const codeReviews = CodeReviewServiceImpl_1.default.getAllCodeReviews();
    res.status(202).json(codeReviews);
});
exports.default = router;
//# sourceMappingURL=CodeReviewRouter.js.map