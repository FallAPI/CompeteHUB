import express from 'express';
import { ParticipantController } from '../../controller/participantController';


const router = express.Router();

// Public route
router.post("/participant", ParticipantController.createParticipant as express.RequestHandler);
router.get("/participant/total", ParticipantController.countTotalParticipant as express.RequestHandler);
router.get("/participant/competition", ParticipantController.getCompetitionName as express.RequestHandler);


export default router;