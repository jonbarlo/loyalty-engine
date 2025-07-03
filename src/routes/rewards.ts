import { Router } from 'express';
import { RewardController } from '../controllers/RewardController';
import { authenticateToken } from '../middleware/auth';

const rewardRouter = Router();

rewardRouter.get('/rewards', authenticateToken, RewardController.getAll);
rewardRouter.get('/rewards/:id', authenticateToken, RewardController.getById);
rewardRouter.post('/rewards', authenticateToken, RewardController.create);
rewardRouter.put('/rewards/:id', authenticateToken, RewardController.update);
rewardRouter.delete('/rewards/:id', authenticateToken, RewardController.delete);

export default rewardRouter; 