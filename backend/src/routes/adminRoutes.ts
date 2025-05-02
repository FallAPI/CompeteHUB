import express from 'express';
import { AdminAuth } from '../controller/adminController';


const router = express.Router();

router.post('/login', AdminAuth.LoginAdmin as express.RequestHandler);
router.post('/logout', AdminAuth.LogoutAdmin as express.RequestHandler);

export default router;