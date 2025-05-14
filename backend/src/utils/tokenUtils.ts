import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();


const ACCESS_SECRET =  process.env.ACCEST_SECRET!;
const REFRESH_SECRET = process.env.REFRESH_SECRET!;

export const generateAccessToken = (payload: object) => {
    return jwt.sign(payload, ACCESS_SECRET, {expiresIn: "15m"});
};

export const generateRefreshToken = (payload: object) => {
    return jwt.sign(payload, REFRESH_SECRET, { expiresIn: '7d' });
};

export const verifyRefershToken = (Token: string) => {
   return jwt.verify(Token, REFRESH_SECRET);
};

export const verifyAccesToken = (Token: string) => {
   return jwt.verify(Token, ACCESS_SECRET);
};