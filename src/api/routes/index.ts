import { Router } from 'express';
import transactionRoutes from './transaction.routes';
import userRoutes from './user.routes';
import rateRoutes from './rate.routes';
import { setupSwagger } from '../swagger';

const router = Router();

setupSwagger(router);
router.use('/transactions', transactionRoutes);
router.use('/users', userRoutes);
router.use('/rates', rateRoutes);

export default router;