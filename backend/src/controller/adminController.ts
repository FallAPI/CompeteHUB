import { NextFunction, Request, Response } from "express";
import AdminService from "../services/adminService";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

export class AdminAuth{
     static async LoginAdmin(req: Request, res: Response): Promise<Response | void> {
        try {
            const {email, password} = req.body;

            if(!email || !password){
                return res.status(400).json({
                    message: "Email and password are required"
                });
            }

            const admin = await AdminService.findbyEmail(email);

            if(!admin){
                return res.status(401).json({
                    message: "Invalid email"
                });
            }
            
            const ispasswordValid = await AdminService.comparePassword(password, admin.password);
            if(!ispasswordValid){
                return res.status(401).json({
                    message: "Invalid password"
                });
            }

            const token = jwt.sign({id: admin.id, email: admin.email,}, JWT_SECRET, {expiresIn: "1h"});

            res.status(200).json({
                message: "Login successful",
                token: token,
                admin: admin.toJSON()
            });
        } catch (error) {
            console.error("Error login as admin:", error);
            res.status(500).json({ message: "Internal server error" });
        };
    };

      static async LogoutAdmin(req: Request, res: Response): Promise<Response | void> {
          // Let the client handle deleting the JWT
        try {
            res.status(200).json({
                message: "Logout successful"
            });
        } catch (error) {
            console.error("Error logging out admin:", error);
            res.status(500).json({ message: "Internal server error" });
        };
    };

}


