import { Router } from 'express';
import { PunchCardController } from '../controllers/PunchCardController';
import { authenticateToken } from '../middleware/auth';

const punchCardRouter = Router();

punchCardRouter.get('/punch-cards', authenticateToken, PunchCardController.getAll);
punchCardRouter.get('/punch-cards/:id', authenticateToken, PunchCardController.getById);
punchCardRouter.post('/punch-cards', authenticateToken, PunchCardController.create);
punchCardRouter.put('/punch-cards/:id', authenticateToken, PunchCardController.update);
punchCardRouter.delete('/punch-cards/:id', authenticateToken, PunchCardController.delete);
punchCardRouter.post('/punch-cards/:id/earn', authenticateToken, PunchCardController.earnPunch);
punchCardRouter.post('/punch-cards/:id/redeem', authenticateToken, PunchCardController.redeem);
punchCardRouter.get('/my-punch-cards', authenticateToken, PunchCardController.getMine);

export default punchCardRouter; 