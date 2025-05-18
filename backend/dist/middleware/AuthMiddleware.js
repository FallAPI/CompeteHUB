"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.middlewareAuth = void 0;
const tokenUtils_1 = require("../utils/tokenUtils");
class middlewareAuth {
    static async AuthMiddleware(req, res, next) {
        const authHeader = req.headers['authorization'];
        const token = typeof authHeader === 'string'
            ? authHeader.split(' ')[1]
            : null;
        if (!token) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }
        try {
            const payload = (0, tokenUtils_1.verifyAccesToken)(token);
            req.admin = payload;
            next();
        }
        catch (error) {
            return res.status(403).json({
                message: "Forbidden"
            });
        }
    }
}
exports.middlewareAuth = middlewareAuth;
