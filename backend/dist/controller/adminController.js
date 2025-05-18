"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminAuth = void 0;
const adminService_1 = __importDefault(require("../services/adminService"));
const tokenUtils_1 = require("../utils/tokenUtils");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET;
const isProduction = process.env.NODE_ENV === 'production';
class AdminAuth {
    static async LoginAdmin(req, res) {
        try {
            let { email, password } = req.body;
            email = email.toLowerCase();
            if (!email || !password) {
                return res.status(400).json({
                    message: "Email and password are required"
                });
            }
            const admin = await adminService_1.default.findbyEmail(email);
            if (!admin) {
                return res.status(401).json({
                    message: "Invalid email"
                });
            }
            const ispasswordValid = await adminService_1.default.comparePassword(password, admin.password);
            if (!ispasswordValid) {
                return res.status(401).json({
                    message: "Invalid password"
                });
            }
            const accesToken = (0, tokenUtils_1.generateAccessToken)({ id: admin.id, email: admin.email });
            const refreshToken = (0, tokenUtils_1.generateRefreshToken)({ id: admin.id, email: admin.email });
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
        }
        catch (error) {
            console.error("Error login as admin:", error);
            res.status(500).json({ message: "Internal server error" });
        }
        ;
    }
    ;
    static async refreshToken(req, res) {
        const token = req.cookies.refreshToken;
        if (!token)
            return res.status(401).json({ message: "No refresh token" });
        try {
            const payload = (0, tokenUtils_1.verifyRefershToken)(token);
            const accessToken = (0, tokenUtils_1.generateAccessToken)({ id: payload.id, email: payload.email });
            console.log("Cookies from request:", req.cookies);
            console.log("refreshToken value:", req.cookies.refreshToken);
            // Set the access token in a cookie as well
            res.cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: isProduction,
                sameSite: isProduction ? "none" : "lax",
                maxAge: 15 * 60 * 1000, // 15 minutes
            });
            res.status(200).json({ accessToken });
        }
        catch (error) {
            console.error("Refresh token verification failed:", error);
            res.status(403).json({ message: "Invalid refresh token" });
        }
        ;
    }
    static async logout(req, res) {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
        });
        return res.status(200).json({ message: "Logout successful" });
    }
}
exports.AdminAuth = AdminAuth;
