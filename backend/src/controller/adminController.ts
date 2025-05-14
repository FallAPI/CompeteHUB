import {Request, Response } from "express";
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
                secure: false,
                sameSite: "lax",
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
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
            const accessToken = generateAccessToken({id: payload.id, email: payload.email});

            console.log("Cookies from request:", req.cookies);
            console.log("refreshToken value:", req.cookies.refreshToken);


                // Set the access token in a cookie as well
                res.cookie("accessToken", accessToken, {
                    httpOnly: true,
                    secure: false,
                    sameSite: "lax",
                    maxAge: 15 * 60 * 1000, // 15 minutes
                });

            res.status(200).json({accessToken});
        } catch (error) {
            console.error("Refresh token verification failed:", error);
            res.status(403).json({ message: "Invalid refresh token" });
        };
    }

    static async logout(req: Request, res: Response): Promise<Response | void> {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
        });

        return res.status(200).json({ message: "Logout successful" });
    }


}


