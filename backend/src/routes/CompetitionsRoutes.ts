import express from 'express';
import { CompetitionsController } from '../controller/competitionsController';

const router = express.Router();

router.get('/competition', CompetitionsController.getCompetetions as express.RequestHandler);
router.get("/competition/:id", CompetitionsController.getCompetitionByID as express.RequestHandler);
router.get("/competition/total", CompetitionsController.countCompetition as express.RequestHandler);
router.get("/competition/ongoing", CompetitionsController.countOngoinCompetition as express.RequestHandler);
router.get("/competition/finish", CompetitionsController.countFinishedCompetition as express.RequestHandler);
router.post("/competition", CompetitionsController.createCompetetions as express.RequestHandler);
router.put("/competition/:id", CompetitionsController.updateCompetetion as express.RequestHandler);
router.delete("/competition/:id", CompetitionsController.deleteCompetetion as express.RequestHandler);


export default router;