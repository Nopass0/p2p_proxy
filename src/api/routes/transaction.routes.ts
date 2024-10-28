import { Router } from 'express';
import { createTransaction, getTransaction, uploadScreenshot } from '../controllers/transaction.controller';
import { authMiddleware } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

router.post('/', authMiddleware, createTransaction);
router.get('/:id', authMiddleware, getTransaction);
router.post('/:id/screenshot', authMiddleware, upload.single('screenshot'), uploadScreenshot);

export default router;