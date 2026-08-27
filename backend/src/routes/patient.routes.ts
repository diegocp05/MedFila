import { Router } from 'express';
import { createPatient, getQueue, updateStatus } from '../controllers/patient.controller';

const router = Router();

router.post('/', createPatient);
router.get('/queue', getQueue);
router.put('/:id/status', updateStatus);

export default router;
