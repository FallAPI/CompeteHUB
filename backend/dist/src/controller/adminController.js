"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminAuth = void 0;
const adminService_1 = __importDefault(require("../services/adminService"));
const tokenUtils_1 = require("../utils/tokenUtils");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const isProduction = process.env.NODE_ENV === 'production';
class AdminAuth {
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
    static LoginAdmin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { email, password } = req.body;
                email = email.toLowerCase();
                if (!email || !password) {
                    return res.status(400).json({
                        message: "Email and password are required"
                    });
                }
                const admin = yield adminService_1.default.findbyEmail(email);
                if (!admin) {
                    return res.status(401).json({
                        message: "Invalid email"
                    });
                }
                const ispasswordValid = yield adminService_1.default.comparePassword(password, admin.password);
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
        });
    }
    ;
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
    static refreshToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = req.cookies.refreshToken;
            if (!token)
                return res.status(401).json({ message: "No refresh token" });
            try {
                const payload = (0, tokenUtils_1.verifyRefershToken)(token);
                const accessToken = (0, tokenUtils_1.generateAccessToken)({ id: payload.id, email: payload.email });
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
        });
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
    static logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.clearCookie("refreshToken", {
                httpOnly: true,
                secure: isProduction,
                sameSite: isProduction ? "none" : "lax",
            });
            return res.status(200).json({ message: "Logout successful" });
        });
    }
}
exports.AdminAuth = AdminAuth;
