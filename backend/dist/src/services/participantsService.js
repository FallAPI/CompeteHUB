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
const participant_1 = require("../models/participant");
class participantService {
    static create(participant) {
        return __awaiter(this, void 0, void 0, function* () {
            const [result] = yield database_1.default.query("INSERT INTO tbl_participant (team_name, captain_email, first_member, second_member, competition_id) VALUES (?, ?, ?, ?, ?)", [
                participant.team_name,
                participant.captain_email,
                participant.first_member,
                participant.second_member,
                participant.competition_id
            ]);
            participant.participant_id = result.insertId;
            return participant;
        });
    }
    static findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield database_1.default.query("SELECT participant_id, team_name, captain_email, first_member, second_member,tbl_competition.name FROM tbl_participant INNER JOIN tbl_competition ON tbl_participant.competition_id = tbl_competition.id_competition");
            return rows.map((row) => participant_1.Participant.fromJSON(row));
        });
    }
    static update(participant) {
        return __awaiter(this, void 0, void 0, function* () {
            //Check if the new captain_email exists in other records (excluding this participant)
            const [existing] = yield database_1.default.query("SELECT participant_id FROM tbl_participant WHERE captain_email = ? AND participant_id != ?", [participant.captain_email, participant.participant_id]);
            if (existing.length > 0) {
                throw new Error("captain_email already used by another participant");
            }
            //Proceed with update if email is unique or unchanged
            yield database_1.default.query("UPDATE tbl_participant SET team_name = ?, captain_email = ?, first_member = ?, second_member = ?, competition_id = ? WHERE participant_id = ?", [
                participant.team_name,
                participant.captain_email,
                participant.first_member,
                participant.second_member,
                participant.competition_id,
                participant.participant_id,
            ]);
        });
    }
    static delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default.query("DELETE FROM tbl_participant WHERE participant_id = ?", [id]);
        });
    }
    static findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield database_1.default.query("SELECT * FROM tbl_participant WHERE participant_id =?", [id]);
            return rows.length > 0 ? participant_1.Participant.fromJSON(rows[0]) : null;
        });
    }
    static getAllCompetitions() {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield database_1.default.query("SELECT id_competition, name FROM tbl_competition");
            return rows;
        });
    }
    static countAllParticipant() {
        return __awaiter(this, void 0, void 0, function* () {
            const [rows] = yield database_1.default.query("SELECT COUNT(*) AS total FROM tbl_participant");
            return rows[0].total;
        });
    }
}
exports.default = participantService;
