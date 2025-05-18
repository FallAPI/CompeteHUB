"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const participantController_1 = require("../controller/participantController");
const router = express_1.default.Router();
router.post("/participant", participantController_1.ParticipantController.createParticipant);
router.get("/participant", participantController_1.ParticipantController.getParticipant);
router.get("/participant/competition", participantController_1.ParticipantController.getCompetitionName);
router.get("/participant/total", participantController_1.ParticipantController.countTotalParticipant);
router.put("/participant/:id", participantController_1.ParticipantController.updateParticipant);
router.delete("/participant/:id", participantController_1.ParticipantController.deleteParticipant);
exports.default = router;
