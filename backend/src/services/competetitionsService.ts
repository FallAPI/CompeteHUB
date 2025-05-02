import pool from "../services/database";
import { Competetions, ICompetetions } from "../models/competetions";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export default class CompetetionsService {
    
    static async findById(id: number): Promise<Competetions | null> {
        const [rows] = await pool.query<ICompetetions[] & RowDataPacket[]>(
            "SELECT * FROM tbl_competetions WHERE id = ? LIMIT 1",
            [id]
        );
        return rows.length > 0 ? Competetions.fromJSON(rows[0]) : null;
    }

    static async findAll(): Promise<Competetions[]> {
        const [rows] = await pool.query<ICompetetions[] & RowDataPacket[]>(
            "SELECT * FROM tbl_competetions"
        );
        return rows.map((row) => Competetions.fromJSON(row));
    }

    static async create(competetion: Competetions): Promise<Competetions> {
        const [result] = await pool.query<ResultSetHeader>(
            "INSERT INTO tbl_competetions (name, description, startDate, endDate) VALUES (?, ?, ?, ?)",
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

    static async update(competetion: Competetions): Promise<void> {
        await pool.query<ResultSetHeader>(
            "UPDATE tbl_competetions SET name = ?, description = ?, startDate = ?, endDate = ? WHERE id = ?",
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
        await pool.query<ResultSetHeader>("DELETE FROM tbl_competetions WHERE id = ?", [id]);
    }
}