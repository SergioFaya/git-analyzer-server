"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Logger_1 = require("../../../logger/Logger");
const router = express_1.Router();
router.post('/hooks', (req, res) => {
    Logger_1.logger.log('info', 'WEBHOOKS: title of the issue ' + req.body.issue.title);
    res.status(200).json({
        message: req.body.issue,
        success: true,
    });
});
exports.default = router;
//# sourceMappingURL=WebHooksRouter.js.map