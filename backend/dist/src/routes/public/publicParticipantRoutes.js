"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const participantController_1 = require("../../controller/participantController");
const router = express_1.default.Router();
// Public route
router.post("/participant", participantController_1.ParticipantController.createParticipant);
router.get("/participant/total", participantController_1.ParticipantController.countTotalParticipant);
router.get("/participant/competition", participantController_1.ParticipantController.getCompetitionName);
exports.default = router;
