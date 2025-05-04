import express from 'express';
import { AdminAuth } from '../controller/adminController';
import { middlewareAuth } from '../middleware/AuthMiddleware';


const router = express.Router();

router.post('/login', AdminAuth.LoginAdmin as express.RequestHandler);
router.get(
  '/dashboard',
  middlewareAuth.AuthMiddleware as express.RequestHandler,
  (req: express.Request, res: express.Response) => {
    const admin = (req as any).admin;
    res.status(200).json({
      message: "Welcome to the dashboard",
      admin,
    });
  }
);

export default router;