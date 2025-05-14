import express from 'express';
import { ParticipantController } from '../controller/participantController';

const router = express.Router();

router.post("/participant", ParticipantController.createParticipant as express.RequestHandler);
router.get("/participant", ParticipantController.getParticipant as express.RequestHandler);
router.get("/participant/competition", ParticipantController.getCompetitionName as express.RequestHandler);
router.get("/participant/total", ParticipantController.countTotalParticipant as express.RequestHandler);
router.put("/participant/:id", ParticipantController.updateParticipant as express.RequestHandler);
router.delete("/participant/:id", ParticipantController.deleteParticipant as express.RequestHandler);


export default router;