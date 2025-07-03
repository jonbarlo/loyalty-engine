import { Router } from 'express';
import { BusinessController } from '../controllers/BusinessController';
import { authenticateToken } from '../middleware/auth';

const businessRouter = Router();

businessRouter.get('/businesses', authenticateToken, BusinessController.getAll);
businessRouter.get('/businesses/:id', authenticateToken, BusinessController.getById);
businessRouter.post('/businesses', authenticateToken, BusinessController.create);
businessRouter.put('/businesses/:id', authenticateToken, BusinessController.update);
businessRouter.delete('/businesses/:id', authenticateToken, BusinessController.delete);

export default businessRouter; 