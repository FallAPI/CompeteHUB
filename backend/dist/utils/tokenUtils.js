"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAccesToken = exports.verifyRefershToken = exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const ACCESS_SECRET = process.env.ACCEST_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;
const generateAccessToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, ACCESS_SECRET, { expiresIn: "15m" });
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, REFRESH_SECRET, { expiresIn: '7d' });
};
exports.generateRefreshToken = generateRefreshToken;
const verifyRefershToken = (Token) => {
    return jsonwebtoken_1.default.verify(Token, REFRESH_SECRET);
};
exports.verifyRefershToken = verifyRefershToken;
const verifyAccesToken = (Token) => {
    return jsonwebtoken_1.default.verify(Token, ACCESS_SECRET);
};
exports.verifyAccesToken = verifyAccesToken;
