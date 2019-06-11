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
class Repo extends typegoose_1.Typegoose {
    constructor(id, node_id, name, full_name, html_url, description, url, updated_at, open_issues, owner) {
        super();
        this.id = id;
        this.node_id = node_id;
        this.name = name;
        this.full_name = full_name;
        this.html_url = html_url;
        this.description = description;
        this.url = url;
        this.updated_at = updated_at;
        this.open_issues = open_issues;
        this.owner = owner;
    }
}
__decorate([
    typegoose_1.prop({ index: true, required: true }),
    __metadata("design:type", Number)
], Repo.prototype, "id", void 0);
__decorate([
    typegoose_1.prop({ required: true }),
    __metadata("design:type", String)
], Repo.prototype, "node_id", void 0);
__decorate([
    typegoose_1.prop({ required: true }),
    __metadata("design:type", String)
], Repo.prototype, "name", void 0);
__decorate([
    typegoose_1.prop({ required: true }),
    __metadata("design:type", String)
], Repo.prototype, "full_name", void 0);
__decorate([
    typegoose_1.prop({ required: true }),
    __metadata("design:type", String)
], Repo.prototype, "html_url", void 0);
__decorate([
    typegoose_1.prop({ required: false }),
    __metadata("design:type", String)
], Repo.prototype, "description", void 0);
__decorate([
    typegoose_1.prop({ required: true }),
    __metadata("design:type", String)
], Repo.prototype, "url", void 0);
__decorate([
    typegoose_1.prop({ required: true }),
    __metadata("design:type", String)
], Repo.prototype, "updated_at", void 0);
__decorate([
    typegoose_1.prop({ required: true }),
    __metadata("design:type", Number)
], Repo.prototype, "open_issues", void 0);
__decorate([
    typegoose_1.prop(),
    __metadata("design:type", Object)
], Repo.prototype, "owner", void 0);
exports.Repo = Repo;
exports.RepoModel = new Repo().getModelForClass(Repo);
//# sourceMappingURL=RepoSchema.js.map