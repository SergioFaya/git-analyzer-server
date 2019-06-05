"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const typegoose_1 = require("typegoose");
class CodeReview extends typegoose_1.Typegoose {
    constructor(title, created_at, created_by, commentary, calification) {
        super();
        this.title = title;
        this.created_at = created_at;
        this.created_by = created_by;
        this.commentary = commentary;
        this.calification = calification;
    }
}
__decorate([
    typegoose_1.prop({ index: true, required: true }),
    __metadata("design:type", Number)
], CodeReview.prototype, "id", void 0);
__decorate([
    typegoose_1.prop({ required: true }),
    __metadata("design:type", String)
], CodeReview.prototype, "title", void 0);
__decorate([
    typegoose_1.prop({ required: true }),
    __metadata("design:type", Date)
], CodeReview.prototype, "created_at", void 0);
__decorate([
    typegoose_1.prop({ required: true }),
    __metadata("design:type", Object)
], CodeReview.prototype, "created_by", void 0);
__decorate([
    typegoose_1.prop({ required: true }),
    __metadata("design:type", String)
], CodeReview.prototype, "commentary", void 0);
__decorate([
    typegoose_1.prop({ required: true }),
    __metadata("design:type", Number)
], CodeReview.prototype, "calification", void 0);
exports.CodeReview = CodeReview;
exports.CodeReviewModel = new CodeReview().getModelForClass(CodeReview);
//# sourceMappingURL=CodeReviewSchema.js.map