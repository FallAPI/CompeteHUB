"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const swagger_1 = require("./src/swagger");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const adminRoutes_1 = __importDefault(require("./src/routes/adminRoutes"));
const competitionsRoutes_1 = __importDefault(require("./src/routes/competitionsRoutes"));
const participantRoutes_1 = __importDefault(require("./src/routes/participantRoutes"));
const corsOptions = {
    origin: ['http://localhost:5501', 'http://localhost:5500'],
    credentials: true,
};
const app = (0, express_1.default)();
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
(0, swagger_1.setupSwagger)(app);
app.use('/admin', adminRoutes_1.default);
app.use("/admin/api", competitionsRoutes_1.default);
app.use("/admin/api", participantRoutes_1.default);
const PORT = parseInt(process.env.PORT, 10) || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
