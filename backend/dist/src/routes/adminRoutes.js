"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = require("../controller/adminController");
const AuthMiddleware_1 = require("../middleware/AuthMiddleware");
const router = express_1.default.Router();
router.post('/login', adminController_1.AdminAuth.LoginAdmin);
router.post("/refresh-token", adminController_1.AdminAuth.refreshToken);
router.post("/logout", adminController_1.AdminAuth.logout);
router.get('/dashboard', AuthMiddleware_1.middlewareAuth.AuthMiddleware, (req, res) => {
    res.json({ message: `Welcome Admin ${req.admin.email}` });
});
exports.default = router;
