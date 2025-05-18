import {Request, Response } from "express";
import AdminService from "../services/adminService";
import { generateAccessToken, generateRefreshToken, verifyRefershToken } from '../utils/tokenUtils';
import dotenv from "dotenv";

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';


export class AdminAuth{
   /**
     * @swagger
     * /admin/login:
     *   post:
     *     summary: Admin login
     *     description: Logs in an admin and returns a JWT access token and sets refresh token in cookies.
     *     tags:
     *       - Admin Authentication
     *     security: [] # This removes the global security requirement for this specific endpoint
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - email
     *               - password
     *             properties:
     *               email:
     *                 type: string
     *                 example: Naufal@gmail.com
     *               password:
     *                 type: string
     *                 example: NaufalAdmin12345
     *     responses:
     *       200:
     *         description: Login successful
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: Login successful
     *                 token:
     *                   type: string
     *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
     *                 admin:
     *                   $ref: '#/components/schemas/Admin'
     *       400:
     *         description: Email and password are required
     *       401:
     *         description: Invalid email or password
     *       500:
     *         description: Internal server error
     */
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
                secure: isProduction,
                sameSite: isProduction ? "none" : "lax",
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
              });
              

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

    /**
     * @swagger
     * /admin/refresh-token:
     *   post:
     *     summary: Refresh access token
     *     description: Refreshes the access token using the refresh token from cookies.
     *     tags:
     *       - Admin Authentication
     *     security: [] # This removes the global security requirement for this specific endpoint
     *     responses:
     *       200:
     *         description: Access token refreshed successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 accessToken:
     *                   type: string
     *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
     *       401:
     *         description: No refresh token provided
     *       403:
     *         description: Invalid refresh token
     */
    static async refreshToken(req: Request, res: Response): Promise<Response | void> {
        const token = req.cookies.refreshToken;
        if(!token) return res.status(401).json({message: "No refresh token"});

        try {
            const payload = verifyRefershToken(token) as any;
            const accessToken = generateAccessToken({id: payload.id, email: payload.email});

                // Set the access token in a cookie as well
                res.cookie("accessToken", accessToken, {
                    httpOnly: true,
                    secure: isProduction,
                    sameSite: isProduction ? "none" : "lax",
                    maxAge: 15 * 60 * 1000, // 15 minutes
                  });
                  

            res.status(200).json({accessToken});
        } catch (error) {
            console.error("Refresh token verification failed:", error);
            res.status(403).json({ message: "Invalid refresh token" });
        };
    }

    /**
     * @swagger
     * /admin/logout:
     *   post:
     *     summary: Admin logout
     *     description: Logs out an admin by clearing the refresh token cookie.
     *     tags:
     *       - Admin Authentication
     *     responses:
     *       200:
     *         description: Logout successful
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                   example: Logout successful
     */
    static async logout(req: Request, res: Response): Promise<Response | void> {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
          });
          

        return res.status(200).json({ message: "Logout successful" });
    }


}


