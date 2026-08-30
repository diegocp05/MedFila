import { Router } from 'express';
import { createConsultation, getHistory } from '../controllers/consultation.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.post('/', createConsultation);
router.get('/history', getHistory);

export default router;
