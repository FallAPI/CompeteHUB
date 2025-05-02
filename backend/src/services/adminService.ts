import pool from '../services/database';
import {Admin, IAdmin} from "../models/admin";
import bcrypt from "bcrypt";
import { RowDataPacket } from 'mysql2';

export default class AdminService{
    static async findbyEmail(email : string): Promise<Admin | null>{
        const [rows] = await pool.query<IAdmin[] & RowDataPacket[]>(
            "SELECT * FROM tbl_admin WHERE email = ? LIMIIT 1",
            [email]
        );
        return rows.length > 0 ? Admin.fromJSON(rows[0]) : null;
    }

    static async comparePassword(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }
}