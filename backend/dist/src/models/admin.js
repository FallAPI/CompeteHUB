"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Admin = void 0;
class Admin {
    constructor(id, name, email, password, createdAt) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.createdAt = createdAt;
    }
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            email: this.email,
            password: this.password,
            createdAt: this.createdAt.toISOString()
        };
    }
    static fromJSON(json) {
        return new Admin(json.id, json.name, json.email, json.password, json.createdAt ? new Date(json.createdAt) : new Date());
    }
}
exports.Admin = Admin;
