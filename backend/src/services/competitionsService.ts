import pool from "./database";
import { Competitions, ICompetitions } from "../models/Competitions";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export default class CompetitionsService {
    
    static async findById(id: number): Promise<Competitions | null> {
        const [rows] = await pool.query<ICompetitions[] & RowDataPacket[]>(
            "SELECT * FROM tbl_competetion WHERE id = ? LIMIT 1",
            [id]
        );
        return rows.length > 0 ? Competitions.fromJSON(rows[0]) : null;
    }

    static async findAll(): Promise<Competitions[]> {
        const [rows] = await pool.query<ICompetitions[] & RowDataPacket[]>(
            "SELECT * FROM tbl_competetion"
        );
        return rows.map((row) => Competitions.fromJSON(row));
    }

    static async create(competetion: Competitions): Promise<Competitions> {
        const [result] = await pool.query<ResultSetHeader>(
            "INSERT INTO tbl_competetion (name, description, start_date, end_date) VALUES (?, ?, ?, ?)",
            [
                competetion.name,
                competetion.description,
                competetion.startDate,
                competetion.endDate,
            ]
        );
        competetion.id = result.insertId;
        return competetion;
    }

    static async update(competetion: Competitions): Promise<void> {
        await pool.query<ResultSetHeader>(
            "UPDATE tbl_competetion SET name = ?, description = ?, start_date = ?, end_date = ? WHERE id = ?",
            [
                competetion.name,
                competetion.description,
                competetion.startDate,
                competetion.endDate,
                competetion.id,
            ]
        );
    }

    static async delete(id: number): Promise<void> {
        await pool.query<ResultSetHeader>("DELETE FROM tbl_competetion WHERE id = ?", [id]);
    }
}