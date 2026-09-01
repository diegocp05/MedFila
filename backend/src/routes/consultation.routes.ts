import { Router } from 'express';
import { createConsultation, getHistory } from '../controllers/consultation.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

router.use(requireAuth);

router.post('/', createConsultation);
router.get('/history', getHistory);

export default router;
