import { Router } from 'express';
import { BusinessController } from '../controllers/BusinessController';
import { ThemeController } from '../controllers/ThemeController';
import { authenticateToken } from '../middleware/auth';

const businessRouter = Router();

// Public endpoints - no authentication required
businessRouter.get('/public/businesses', BusinessController.getAllPublic);
businessRouter.get('/public/businesses/:id', BusinessController.getPublicInfo);

// Protected endpoints - authentication required
businessRouter.get('/businesses', authenticateToken, BusinessController.getAll);
businessRouter.get('/businesses/:id', authenticateToken, BusinessController.getById);
businessRouter.post('/businesses', authenticateToken, BusinessController.create);
businessRouter.put('/businesses/:id', authenticateToken, BusinessController.update);
businessRouter.delete('/businesses/:id', authenticateToken, BusinessController.delete);

// Theme endpoints
businessRouter.get('/businesses/:id/theme', ThemeController.getTheme);
businessRouter.post('/businesses/:id/theme', authenticateToken, ThemeController.createOrUpdateTheme);
businessRouter.put('/businesses/:id/theme', authenticateToken, ThemeController.updateTheme);
businessRouter.delete('/businesses/:id/theme', authenticateToken, ThemeController.deleteTheme);
businessRouter.get('/themes/default', ThemeController.getDefaultTheme);

export default businessRouter; 