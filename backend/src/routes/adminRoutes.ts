import express from 'express';
import { AdminAuth } from '../controller/adminController';
import { middlewareAuth } from '../middleware/AuthMiddleware';


const router = express.Router();

router.post('/login', AdminAuth.LoginAdmin as express.RequestHandler);
router.post("/refresh-token", AdminAuth.refreshToken as express.RequestHandler);
router.post("/logout", AdminAuth.logout as express.RequestHandler);
router.get(
  '/dashboard',
  middlewareAuth.AuthMiddleware as express.RequestHandler,
  (req: express.Request, res: express.Response) => {
    res.json({ message: `Welcome Admin ${(req as any).admin.email}` });
  }
);

export default router;