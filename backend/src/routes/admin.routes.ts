import { Router } from 'express';
import { getDashboardStats } from '../controllers/admin.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

router.use(requireAuth);

router.get('/stats', getDashboardStats);

export default router;
