import { Request, Response, RequestHandler } from 'express';
import { logger } from '../utils/logger';
import { ThemeService } from '../services/themeService';

export class ThemeController {
    // Get theme for a business
    public static getTheme: RequestHandler = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            
            if (!id) {
                res.status(400).json({ error: 'Business ID is required' });
                return;
            }
            
            const businessId = parseInt(id ?? '');
            
            if (isNaN(businessId)) {
                res.status(400).json({ error: 'Invalid business ID' });
                return;
            }

            logger(`API endpoint GET /businesses/${id}/theme was called...`);
            const theme = await ThemeService.getThemeByBusinessId(businessId);
            
            if (!theme) {
                res.status(404).json({ 
                    error: 'Theme not found for this business',
                    message: 'No theme has been configured for this business yet'
                });
                return;
            }

            res.json(theme);
        } catch (error) {
            logger(`Error getting theme: ${error}`);
            res.status(500).json({ error: 'Internal server error' });
        }
    };

    // Create or update theme for a business
    public static createOrUpdateTheme: RequestHandler = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const themeData = req.body;
            
            // Check authorization - only admin and business_owner can manage themes
            // @ts-ignore
            const { role, businessId: userBusinessId } = req.user || {};
            if (role !== 'admin' && role !== 'business_owner') {
                res.status(403).json({ 
                    error: 'Only administrators and business owners can manage themes' 
                });
                return;
            }

            // Business owners can only manage their own business theme
            if (role === 'business_owner' && typeof userBusinessId === 'number') {
                const targetBusinessId = parseInt(id ?? '');
                if (targetBusinessId !== userBusinessId) {
                    res.status(403).json({ 
                        error: 'Business owners can only manage themes for their own business' 
                    });
                    return;
                }
            }
            
            if (!id) {
                res.status(400).json({ error: 'Business ID is required' });
                return;
            }
            
            const businessId = parseInt(id ?? '');
            
            if (isNaN(businessId)) {
                res.status(400).json({ error: 'Invalid business ID' });
                return;
            }

            // Validate required fields
            const requiredFields = ['primaryColor', 'secondaryColor', 'backgroundColor', 'errorColor', 'textPrimaryColor', 'onPrimaryColor'];
            const missingFields = requiredFields.filter(field => !themeData[field]);
            
            if (missingFields.length > 0) {
                res.status(400).json({ 
                    error: 'Missing required fields',
                    missingFields,
                    message: `The following fields are required: ${missingFields.join(', ')}`
                });
                return;
            }

            logger(`API endpoint POST /businesses/${id}/theme was called...`);
            const theme = await ThemeService.createOrUpdateTheme(businessId, themeData);
            
            res.status(201).json({
                message: 'Theme created/updated successfully',
                theme
            });
        } catch (error) {
            logger(`Error creating/updating theme: ${error}`);
            
            // Handle validation errors
            if (error instanceof Error && error.message.includes('Theme validation failed')) {
                res.status(400).json({ 
                    error: 'Theme validation failed',
                    details: error.message.replace('Theme validation failed: ', ''),
                    message: 'Please check the theme data and try again'
                });
                return;
            }
            
            res.status(500).json({ error: 'Internal server error' });
        }
    };

    // Update theme for a business
    public static updateTheme: RequestHandler = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const themeData = req.body;
            
            // Check authorization - only admin and business_owner can manage themes
            // @ts-ignore
            const { role, businessId: userBusinessId } = req.user || {};
            if (role !== 'admin' && role !== 'business_owner') {
                res.status(403).json({ 
                    error: 'Only administrators and business owners can manage themes' 
                });
                return;
            }

            // Business owners can only manage their own business theme
            if (role === 'business_owner' && typeof userBusinessId === 'number') {
                const targetBusinessId = parseInt(id ?? '');
                if (targetBusinessId !== userBusinessId) {
                    res.status(403).json({ 
                        error: 'Business owners can only manage themes for their own business' 
                    });
                    return;
                }
            }
            
            if (!id) {
                res.status(400).json({ error: 'Business ID is required' });
                return;
            }
            
            const businessId = parseInt(id ?? '');
            
            if (isNaN(businessId)) {
                res.status(400).json({ error: 'Invalid business ID' });
                return;
            }

            logger(`API endpoint PUT /businesses/${id}/theme was called...`);
            const theme = await ThemeService.createOrUpdateTheme(businessId, themeData);
            
            res.json({
                message: 'Theme updated successfully',
                theme
            });
        } catch (error) {
            logger(`Error updating theme: ${error}`);
            
            // Handle validation errors
            if (error instanceof Error && error.message.includes('Theme validation failed')) {
                res.status(400).json({ 
                    error: 'Theme validation failed',
                    details: error.message.replace('Theme validation failed: ', ''),
                    message: 'Please check the theme data and try again'
                });
                return;
            }
            
            res.status(500).json({ error: 'Internal server error' });
        }
    };

    // Delete theme for a business
    public static deleteTheme: RequestHandler = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            
            // Check authorization - only admin and business_owner can manage themes
            // @ts-ignore
            const { role, businessId: userBusinessId } = req.user || {};
            if (role !== 'admin' && role !== 'business_owner') {
                res.status(403).json({ 
                    error: 'Only administrators and business owners can manage themes' 
                });
                return;
            }

            // Business owners can only manage their own business theme
            if (role === 'business_owner' && typeof userBusinessId === 'number') {
                const targetBusinessId = parseInt(id ?? '');
                if (targetBusinessId !== userBusinessId) {
                    res.status(403).json({ 
                        error: 'Business owners can only manage themes for their own business' 
                    });
                    return;
                }
            }
            
            if (!id) {
                res.status(400).json({ error: 'Business ID is required' });
                return;
            }
            
            const businessId = parseInt(id ?? '');
            
            if (isNaN(businessId)) {
                res.status(400).json({ error: 'Invalid business ID' });
                return;
            }

            logger(`API endpoint DELETE /businesses/${id}/theme was called...`);
            const deleted = await ThemeService.deleteTheme(businessId);
            
            if (!deleted) {
                res.status(404).json({ 
                    error: 'Theme not found',
                    message: 'No theme exists for this business'
                });
                return;
            }

            res.json({ 
                message: 'Theme deleted successfully',
                businessId
            });
        } catch (error) {
            logger(`Error deleting theme: ${error}`);
            res.status(500).json({ error: 'Internal server error' });
        }
    };

    // Get default theme template
    public static getDefaultTheme: RequestHandler = async (req: Request, res: Response) => {
        try {
            logger('API endpoint GET /themes/default was called...');
            const defaultTheme = ThemeService.getDefaultTheme();
            
            res.json({
                message: 'Default theme template',
                theme: defaultTheme,
                note: 'This is a template. Replace values with your business-specific theme data.'
            });
        } catch (error) {
            logger(`Error getting default theme: ${error}`);
            res.status(500).json({ error: 'Internal server error' });
        }
    };
} 