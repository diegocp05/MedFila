import { Router } from 'express';
import { createPatient, getQueue, updateStatus } from '../controllers/patient.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', createPatient);
router.get('/queue', getQueue);
router.put('/:id/status', requireAuth, updateStatus);

export default router;
