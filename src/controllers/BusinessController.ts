import { Request, Response, RequestHandler } from 'express';
import Business from '../models/BusinessModel';
import { logger } from '../utils/logger';

export class BusinessController {
    public static getAll: RequestHandler = async (req, res) => {
        try {
            const businesses = await Business.findAll();
            res.json(businesses);
        } catch (error) {
            logger(`Error getting businesses: ${error}`);
            res.status(500).json({ error: 'Internal server error' });
        }
    };

    public static getById: RequestHandler = async (req, res) => {
        try {
            const { id } = req.params;
            const business = await Business.findByPk(id);
            if (!business) {
                res.status(404).json({ error: 'Business not found' });
                return;
            }
            res.json(business);
        } catch (error) {
            logger(`Error getting business by ID: ${error}`);
            res.status(500).json({ error: 'Internal server error' });
        }
    };

    public static create: RequestHandler = async (req, res) => {
        try {
            const { name, email, logoUrl, primaryColor, secondaryColor } = req.body;
            if (!name || !email) {
                res.status(400).json({ error: 'Name and email are required' });
                return;
            }
            const business = await Business.create({ name, email, logoUrl, primaryColor, secondaryColor });
            res.status(201).json(business);
        } catch (error) {
            logger(`Error creating business: ${error}`);
            res.status(500).json({ error: 'Internal server error' });
        }
    };

    public static update: RequestHandler = async (req, res) => {
        try {
            const { id } = req.params;
            const business = await Business.findByPk(id);
            if (!business) {
                res.status(404).json({ error: 'Business not found' });
                return;
            }
            const { name, email, logoUrl, primaryColor, secondaryColor } = req.body;
            await business.update({ name, email, logoUrl, primaryColor, secondaryColor });
            res.json(business);
        } catch (error) {
            logger(`Error updating business: ${error}`);
            res.status(500).json({ error: 'Internal server error' });
        }
    };

    public static delete: RequestHandler = async (req, res) => {
        try {
            const { id } = req.params;
            const business = await Business.findByPk(id);
            if (!business) {
                res.status(404).json({ error: 'Business not found' });
                return;
            }
            await business.destroy();
            res.json({ message: 'Business deleted successfully' });
        } catch (error) {
            logger(`Error deleting business: ${error}`);
            res.status(500).json({ error: 'Internal server error' });
        }
    };

    public static getPublicInfo: RequestHandler = async (req, res) => {
        try {
            const { id } = req.params;
            const business = await Business.findByPk(id, {
                attributes: ['id', 'name', 'logoUrl'] // Only return basic public info
            });
            if (!business) {
                res.status(404).json({ error: 'Business not found' });
                return;
            }
            res.json(business);
        } catch (error) {
            logger(`Error getting public business info: ${error}`);
            res.status(500).json({ error: 'Internal server error' });
        }
    };

    public static getAllPublic: RequestHandler = async (req, res) => {
        try {
            const businesses = await Business.findAll({
                attributes: ['id', 'name', 'logoUrl'] // Only return basic public info
            });
            res.json(businesses);
        } catch (error) {
            logger(`Error getting all public businesses: ${error}`);
            res.status(500).json({ error: 'Internal server error' });
        }
    };
} 