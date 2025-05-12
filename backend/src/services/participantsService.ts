import pool from './database';
import { Participant, IParticipant } from '../models/participant';
import { RowDataPacket , ResultSetHeader } from 'mysql2';

export default class participantService{
    static async create(participant: Participant): Promise<Participant> {
        const [result] = await pool.query<ResultSetHeader>(
            "INSERT INTO tbl_participant (team_name, captain_email, first_member, second_member, competition_id) VALUES (?, ?, ?, ?, ?)",
            [
                participant.teamName,
                participant.captainEmail,
                participant.firstMembers,
                participant.secondMembers,
                participant.competitionId
            ]
        );
        participant.participant_id = result.insertId;
        return participant;
    }

    static async findAll(): Promise<Participant[]>{
        const [rows] = await pool.query<IParticipant[] & RowDataPacket[]>(
            "SELECT * FROM tbl_participant"
        );
        return rows.map((row) => Participant.fromJSON(row));
    }

    static async update(participant: Participant): Promise <void>{
        await pool.query<ResultSetHeader>(
            "UPDATE tbl_participant SET team_name = ?, captain_email = ?, first_member = ?, second_member = ?, competition_id = ?",
            [
                participant.teamName,
                participant.captainEmail,
                participant.firstMembers,
                participant.secondMembers,
                participant.competitionId
            ]
        );
    }

    static async delete(id: number): Promise<void>{
        await pool.query<ResultSetHeader>(
            "DELETE FROM tbl_participan WHERE id = ?", [id]
        );
    }

    static async findById(id: number): Promise<Participant | null>{
        const [rows] = await pool.query<IParticipant[] & RowDataPacket[]>(
            "SELECT * FROM tbl_participant WHERE participant_id =?",
            [id]
        );
        return rows.length > 0 ? Participant.fromJSON(rows[0]): null;
    }
}