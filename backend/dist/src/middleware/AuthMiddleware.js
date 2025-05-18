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
Object.defineProperty(exports, "__esModule", { value: true });
exports.middlewareAuth = void 0;
const tokenUtils_1 = require("../utils/tokenUtils");
class middlewareAuth {
    static AuthMiddleware(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
}
exports.middlewareAuth = middlewareAuth;
