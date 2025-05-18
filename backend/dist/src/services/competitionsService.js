"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("./database"));
const competitions_1 = require("../models/competitions");
class CompetitionsService {
    static findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield database_1.default.query("SELECT * FROM tbl_competition WHERE id_competition = ?", [id]);
            return rows.length > 0 ? competitions_1.Competitions.fromJSON(rows[0]) : null;
        });
    }
    static findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield database_1.default.query("SELECT * FROM tbl_competition ORDER BY id_competition DESC");
            return rows.map((row) => competitions_1.Competitions.fromJSON(row));
        });
    }
    static create(competetion) {
        return __awaiter(this, void 0, void 0, function* () {
            const [result] = yield database_1.default.query("INSERT INTO tbl_competition (name, description, start_date, end_date) VALUES (?, ?, ?, ?)", [
                competetion.name,
                competetion.description,
                competetion.startDate,
                competetion.endDate,
            ]);
            competetion.id_competition = result.insertId;
            return competetion;
        });
    }
    static update(competetion) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default.query("UPDATE tbl_competition SET name = ?, description = ?, start_date = ?, end_date = ? WHERE id_competition = ?", [
                competetion.name,
                competetion.description,
                competetion.startDate,
                competetion.endDate,
                competetion.id_competition,
            ]);
        });
    }
    static countCompetition() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const [rows] = yield database_1.default.query("SELECT COUNT(*) AS total FROM tbl_competition");
            console.log("Competition rows:", rows);
            return Number(((_a = rows[0]) === null || _a === void 0 ? void 0 : _a.total) || 0);
        });
    }
    static countFinishCompetition() {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield database_1.default.query("SELECT COUNT(*) AS total FROM tbl_competition WHERE DATE(end_date) <= CURDATE()");
            return rows[0].total;
        });
    }
    static countOngoingCompetition() {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield database_1.default.query("SELECT COUNT(*) AS total FROM tbl_competition WHERE DATE(start_date) <= CURDATE() AND DATE(end_date) >= CURDATE();");
            return rows[0].total;
        });
    }
    static delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default.query("DELETE FROM tbl_competition WHERE id_competition = ?", [id]);
        });
    }
}
exports.default = CompetitionsService;
