"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../services/database"));
const admin_1 = require("../models/admin");
const bcrypt_1 = __importDefault(require("bcrypt"));
class AdminService {
    static async findbyEmail(email) {
        const [rows] = await database_1.default.query("SELECT * FROM tbl_admin WHERE email = ?", [email]);
        return rows.length > 0 ? admin_1.Admin.fromJSON(rows[0]) : null;
    }
    static async comparePassword(password, hash) {
        return bcrypt_1.default.compare(password, hash);
    }
}
exports.default = AdminService;
