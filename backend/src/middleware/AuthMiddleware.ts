import dotenv from "dotenv";
dotenv.config();

import jwt from "jsonwebtoken";
import {NextFunction, Request, Response } from "express";

export const JWT_SECRET = process.env.JWT_SECRET as string;

export class middlewareAuth{
    static async AuthMiddleware(req: Request, res: Response, next: NextFunction): Promise<Response |void> {
    const authHeader = req.headers['authorization'];

    const token = typeof authHeader === 'string'
    ? authHeader.split(' ')[1] 
    : null;

    if(!token){
        return res.status(401).json({
            message: "Unauthorized"
        });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        (req as any).admin = decoded;
        next();
    } catch (error) {
        return res.status(403).json({
            message: "Forbidden"
        })
    }
}

} 
