import { Router } from 'express';
import { getDashboardStats } from '../controllers/admin.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/stats', getDashboardStats);

export default router;
