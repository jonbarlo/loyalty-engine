import { Router } from 'express';
import { NotificationController } from '../controllers/NotificationController';
import { authenticateToken } from '../middleware/auth';

const notificationRouter = Router();

notificationRouter.get('/notifications', authenticateToken, NotificationController.getAll);
notificationRouter.get('/notifications/:id', authenticateToken, NotificationController.getById);
notificationRouter.post('/notifications', authenticateToken, NotificationController.create);
notificationRouter.put('/notifications/:id', authenticateToken, NotificationController.update);
notificationRouter.delete('/notifications/:id', authenticateToken, NotificationController.delete);
notificationRouter.patch('/notifications/:id/read', authenticateToken, NotificationController.markAsRead);
notificationRouter.get('/my-notifications', authenticateToken, NotificationController.getMine);

export default notificationRouter; 