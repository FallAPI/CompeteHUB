import e, { NextFunction, Request, Response } from "express";
import AdminService from "../services/adminService";
import { generateAccessToken, generateRefreshToken, verifyRefershToken } from '../utils/tokenUtils';
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

export class AdminAuth{
     static async LoginAdmin(req: Request, res: Response): Promise<Response | void> {
        try {
            let {email, password} = req.body;
            email = email.toLowerCase();
            

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

            const accesToken = generateAccessToken({id: admin.id, email: admin.email});
            const refreshToken = generateRefreshToken({id: admin.id, email: admin.email});

            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            })

            res.status(200).json({
                message: "Login successful",
                token: accesToken,
                admin: admin.toJSON()
            });
        } catch (error) {
            console.error("Error login as admin:", error);
            res.status(500).json({ message: "Internal server error" });
        };
    };

    static async refreshToken(req: Request, res: Response): Promise<Response | void> {
        const token = req.cookies.refreshToken;
        if(!token) return res.status(401).json({message: "No refresh token"});

        try {
            const payload = verifyRefershToken(token) as any;
            const accesToken = generateAccessToken({id: payload.id, email: payload.email});

            res.status(200).json({accesToken});
        } catch (error) {
            res.status(403).json({ message: "Invalid refresh token" });
        };
    }

    static async logout(req: Request, res: Response): Promise<Response | void> {
        res.clearCookie("refershToken")
    }


}


