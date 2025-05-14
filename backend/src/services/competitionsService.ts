import pool from "./database";
import { Competitions, ICompetitions } from "../models/competitions";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export default class CompetitionsService {
    
    static async findById(id: number): Promise<Competitions | null> {
        const [rows] = await pool.query<ICompetitions[] & RowDataPacket[]>(
            "SELECT * FROM tbl_competition WHERE id_competition = ?",
            [id]
        );
        return rows.length > 0 ? Competitions.fromJSON(rows[0]) : null;
    }

    static async findAll(): Promise<Competitions[]> {
        const [rows] = await pool.query<ICompetitions[] & RowDataPacket[]>(
            "SELECT * FROM tbl_competition ORDER BY id_competition DESC"
        );
        return rows.map((row) => Competitions.fromJSON(row));
    }

    static async create(competetion: Competitions): Promise<Competitions> {
        const [result] = await pool.query<ResultSetHeader>(
            "INSERT INTO tbl_competition (name, description, start_date, end_date) VALUES (?, ?, ?, ?)",
            [
                competetion.name,
                competetion.description,
                competetion.startDate,
                competetion.endDate,
            ]
        );
        competetion.id_competition = result.insertId;
        return competetion;
    }

    static async update(competetion: Competitions): Promise<void> {
        await pool.query<ResultSetHeader>(
            "UPDATE tbl_competition SET name = ?, description = ?, start_date = ?, end_date = ? WHERE id_competition = ?",
            [
                competetion.name,
                competetion.description,
                competetion.startDate,
                competetion.endDate,
                competetion.id_competition,
            ]
        );
    }

    static async countCompetition(): Promise<number>{
        const [rows] = await pool.query<any[]>(
            "SELECT COUNT(*) as total FROM tbl_competition"
        );
        return rows[0].total;
    }

    static async countFinishCompetition(): Promise<number>{
        const [rows] = await pool.query<any[]>(
            "SELECT COUNT(*) as total FROM tbl_competition WHERE DATE(end_date) <= CURDATE()"
        );
        return rows[0].total;
    }

    static async countOngoingCompetition(): Promise<number>{
        const [rows] = await pool.query<any[]>(
            "SELECT COUNT(*) as total FROM tbl_competition WHERE DATE(start_date) <= CURDATE() AND DATE(end_date) >= CURDATE();"
        );

        return rows[0].total
    }

    static async delete(id: number): Promise<void> {
        await pool.query<ResultSetHeader>("DELETE FROM tbl_competition WHERE id_competition = ?", [id]);
    }
}