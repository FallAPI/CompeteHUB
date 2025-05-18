import express from 'express';
import { CompetitionsController } from '../../controller/competitionsController'

const router = express.Router();


router.get("/competition/total", CompetitionsController.countCompetition as express.RequestHandler);
router.get("/competition/ongoing", CompetitionsController.countOngoinCompetition as express.RequestHandler);
router.get('/competition', CompetitionsController.getCompetetions as express.RequestHandler);
router.get("/competition/:id", CompetitionsController.getCompetitionByID as express.RequestHandler);



export default router;