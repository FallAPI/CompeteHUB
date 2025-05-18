"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("./database"));
const competitions_1 = require("../models/competitions");
class CompetitionsService {
    static async findById(id) {
        const [rows] = await database_1.default.query("SELECT * FROM tbl_competition WHERE id_competition = ?", [id]);
        return rows.length > 0 ? competitions_1.Competitions.fromJSON(rows[0]) : null;
    }
    static async findAll() {
        const [rows] = await database_1.default.query("SELECT * FROM tbl_competition ORDER BY id_competition DESC");
        return rows.map((row) => competitions_1.Competitions.fromJSON(row));
    }
    static async create(competetion) {
        const [result] = await database_1.default.query("INSERT INTO tbl_competition (name, description, start_date, end_date) VALUES (?, ?, ?, ?)", [
            competetion.name,
            competetion.description,
            competetion.startDate,
            competetion.endDate,
        ]);
        competetion.id_competition = result.insertId;
        return competetion;
    }
    static async update(competetion) {
        await database_1.default.query("UPDATE tbl_competition SET name = ?, description = ?, start_date = ?, end_date = ? WHERE id_competition = ?", [
            competetion.name,
            competetion.description,
            competetion.startDate,
            competetion.endDate,
            competetion.id_competition,
        ]);
    }
    static async countCompetition() {
        const [rows] = await database_1.default.query("SELECT COUNT(*) as total FROM tbl_competition");
        return rows[0].total;
    }
    static async countFinishCompetition() {
        const [rows] = await database_1.default.query("SELECT COUNT(*) as total FROM tbl_competition WHERE DATE(end_date) <= CURDATE()");
        return rows[0].total;
    }
    static async countOngoingCompetition() {
        const [rows] = await database_1.default.query("SELECT COUNT(*) as total FROM tbl_competition WHERE DATE(start_date) <= CURDATE() AND DATE(end_date) >= CURDATE();");
        return rows[0].total;
    }
    static async delete(id) {
        await database_1.default.query("DELETE FROM tbl_competition WHERE id_competition = ?", [id]);
    }
}
exports.default = CompetitionsService;
