import express from 'express';
import { ParticipantController } from '../controller/participantController';
import { middlewareAuth } from '../middleware/AuthMiddleware';

const router = express.Router();

// 👇 Public route
router.post("/participant", ParticipantController.createParticipant as express.RequestHandler);


router.use(middlewareAuth.AuthMiddleware as express.RequestHandler);

// Protected routes
router.get("/participant", ParticipantController.getParticipant as express.RequestHandler);
router.get("/participant/competition", ParticipantController.getCompetitionName as express.RequestHandler);
router.get("/participant/total", ParticipantController.countTotalParticipant as express.RequestHandler);
router.put("/participant/:id", ParticipantController.updateParticipant as express.RequestHandler);
router.delete("/participant/:id", ParticipantController.deleteParticipant as express.RequestHandler);

export default router;
