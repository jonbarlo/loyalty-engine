import { Router } from 'express';
import { PointTransactionController } from '../controllers/PointTransactionController';
import { authenticateToken } from '../middleware/auth';

const pointTransactionRouter = Router();

pointTransactionRouter.get('/point-transactions', authenticateToken, PointTransactionController.getAll);
pointTransactionRouter.get('/point-transactions/:id', authenticateToken, PointTransactionController.getById);
pointTransactionRouter.post('/point-transactions', authenticateToken, PointTransactionController.create);
pointTransactionRouter.put('/point-transactions/:id', authenticateToken, PointTransactionController.update);
pointTransactionRouter.delete('/point-transactions/:id', authenticateToken, PointTransactionController.delete);
pointTransactionRouter.post('/point-transactions/earn', authenticateToken, PointTransactionController.earnPoints);
pointTransactionRouter.post('/point-transactions/spend', authenticateToken, PointTransactionController.spendPoints);
pointTransactionRouter.get('/my-point-transactions', authenticateToken, PointTransactionController.getMine);

export default pointTransactionRouter; 