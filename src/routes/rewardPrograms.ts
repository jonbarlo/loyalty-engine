import { Router } from 'express';
import { RewardProgramController } from '../controllers/RewardProgramController';
import { authenticateToken } from '../middleware/auth';

const rewardProgramRouter = Router();

rewardProgramRouter.get('/reward-programs', authenticateToken, RewardProgramController.getAll);
rewardProgramRouter.get('/reward-programs/:id', authenticateToken, RewardProgramController.getById);
rewardProgramRouter.post('/reward-programs', authenticateToken, RewardProgramController.create);
rewardProgramRouter.put('/reward-programs/:id', authenticateToken, RewardProgramController.update);
rewardProgramRouter.delete('/reward-programs/:id', authenticateToken, RewardProgramController.delete);

export default rewardProgramRouter; 