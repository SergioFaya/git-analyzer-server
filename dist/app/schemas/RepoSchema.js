"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typegoose_1 = require("typegoose");
class Repo extends typegoose_1.Typegoose {
    constructor(id, node_id, name, full_name, html_url, description, url, updated_at, open_issues) {
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
    }
}
exports.Repo = Repo;
exports.RepoModel = new Repo().getModelForClass(Repo);
//# sourceMappingURL=RepoSchema.js.map