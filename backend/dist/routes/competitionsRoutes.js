"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const competitionsController_1 = require("../controller/competitionsController");
const router = express_1.default.Router();
router.get('/competition', competitionsController_1.CompetitionsController.getCompetetions);
router.get("/competition/total", competitionsController_1.CompetitionsController.countCompetition);
router.get("/competition/ongoing", competitionsController_1.CompetitionsController.countOngoinCompetition);
router.get("/competition/finish", competitionsController_1.CompetitionsController.countFinishedCompetition);
router.post("/competition", competitionsController_1.CompetitionsController.createCompetetions);
router.put("/competition/:id", competitionsController_1.CompetitionsController.updateCompetetion);
router.delete("/competition/:id", competitionsController_1.CompetitionsController.deleteCompetetion);
exports.default = router;
