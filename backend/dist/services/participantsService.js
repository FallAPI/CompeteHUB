"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("./database"));
const participant_1 = require("../models/participant");
class participantService {
    static async create(participant) {
        const [result] = await database_1.default.query("INSERT INTO tbl_participant (team_name, captain_email, first_member, second_member, competition_id) VALUES (?, ?, ?, ?, ?)", [
            participant.team_name,
            participant.captain_email,
            participant.first_member,
            participant.second_member,
            participant.competition_id
        ]);
        participant.participant_id = result.insertId;
        return participant;
    }
    static async findAll() {
        const [rows] = await database_1.default.query("SELECT participant_id, team_name, captain_email, first_member, second_member,tbl_competition.name FROM tbl_participant INNER JOIN tbl_competition ON tbl_participant.competition_id = tbl_competition.id_competition");
        return rows.map((row) => participant_1.Participant.fromJSON(row));
    }
    static async update(participant) {
        await database_1.default.query("UPDATE tbl_participant SET team_name = ?, captain_email = ?, first_member = ?, second_member = ?, competition_id = ?", [
            participant.team_name,
            participant.captain_email,
            participant.first_member,
            participant.second_member,
            participant.competition_id
        ]);
    }
    static async delete(id) {
        await database_1.default.query("DELETE FROM tbl_participan WHERE id = ?", [id]);
    }
    static async findById(id) {
        const [rows] = await database_1.default.query("SELECT * FROM tbl_participant WHERE participant_id =?", [id]);
        return rows.length > 0 ? participant_1.Participant.fromJSON(rows[0]) : null;
    }
    static async getAllCompetitions() {
        const [rows] = await database_1.default.query("SELECT id_competition, name FROM tbl_competition");
        return rows;
    }
    static async countAllParticipant() {
        const [rows] = await database_1.default.query("SELECT COUNT(*) as total FROM tbl_participant");
        return rows[0].total;
    }
}
exports.default = participantService;
