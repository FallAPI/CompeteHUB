import pool from './database';
import { Participant, IParticipant } from '../models/participant';
import { RowDataPacket , ResultSetHeader } from 'mysql2';

export default class participantService{
    static async create(participant: Participant): Promise<Participant> {
        const [result] = await pool.query<ResultSetHeader>(
            "INSERT INTO tbl_participant (team_name, captain_email, first_member, second_member, competition_id) VALUES (?, ?, ?, ?, ?)",
            [
                participant.team_name,
                participant.captain_email,
                participant.first_member,
                participant.second_member,
                participant.competition_id
            ]
        );
        participant.participant_id = result.insertId;
        return participant;
    }

    static async findAll(): Promise<Participant[]>{
        const [rows] = await pool.query<IParticipant[] & RowDataPacket[]>(
            "SELECT participant_id, team_name, captain_email, first_member, second_member,tbl_competition.name FROM tbl_participant INNER JOIN tbl_competition ON tbl_participant.competition_id = tbl_competition.id_competition"
        );
        return rows.map((row) => Participant.fromJSON(row));
    }

    static async update(participant: Participant): Promise<void> {
        //Check if the new captain_email exists in other records (excluding this participant)
        const [existing] = await pool.query(
          "SELECT participant_id FROM tbl_participant WHERE captain_email = ? AND participant_id != ?",
          [participant.captain_email, participant.participant_id]
        );
      
        if ((existing as any[]).length > 0) {
          throw new Error("captain_email already used by another participant");
        }
      
        //Proceed with update if email is unique or unchanged
        await pool.query<ResultSetHeader>(
          "UPDATE tbl_participant SET team_name = ?, captain_email = ?, first_member = ?, second_member = ?, competition_id = ? WHERE participant_id = ?",
          [
            participant.team_name,
            participant.captain_email,
            participant.first_member,
            participant.second_member,
            participant.competition_id,
            participant.participant_id,  
          ]
        );
      }
      

    static async delete(id: number): Promise<void>{
        await pool.query<ResultSetHeader>(
            "DELETE FROM tbl_participant WHERE participant_id = ?", [id]
        );
    }

    static async findById(id: number): Promise<Participant | null>{
        const [rows] = await pool.query<IParticipant[] & RowDataPacket[]>(
            "SELECT * FROM tbl_participant WHERE participant_id =?",
            [id]
        );
        return rows.length > 0 ? Participant.fromJSON(rows[0]): null;
    }

    static async getAllCompetitions(): Promise<{ id_competition: number, name: string }[]> {
        const [rows] = await pool.query("SELECT id_competition, name FROM tbl_competition");
        return rows as { id_competition: number, name: string }[];
    }

    static async countAllParticipant(): Promise<number>{
        const [rows] = await pool.query<any[]>(
            "SELECT COUNT(*) AS total FROM tbl_participant"
        );
        return rows[0].total;
    }
}