import { Request, Response, RequestHandler } from 'express';
import Reward from '../models/RewardModel';
import { logger } from '../utils/logger';

export class RewardController {
    public static getAll: RequestHandler = async (req, res) => {
        try {
            // @ts-ignore
            const { role, businessId } = req.user || {};
            let rewards;
            if (role === 'business_owner') {
                rewards = await Reward.findAll({ where: { businessId } });
            } else {
                rewards = await Reward.findAll();
            }
            res.json(rewards);
        } catch (error) {
            logger(`Error getting rewards: ${error}`);
            res.status(500).json({ error: 'Internal server error' });
        }
    };

    public static getById: RequestHandler = async (req, res) => {
        try {
            const { id } = req.params;
            const reward = await Reward.findByPk(id);
            if (!reward) {
                res.status(404).json({ error: 'Reward not found' });
                return;
            }
            res.json(reward);
        } catch (error) {
            logger(`Error getting reward by ID: ${error}`);
            res.status(500).json({ error: 'Internal server error' });
        }
    };

    public static create: RequestHandler = async (req, res) => {
        try {
            // @ts-ignore
            const { role, businessId } = req.user || {};
            if (role !== 'business_owner') {
                res.status(403).json({ error: 'Only business owners can create rewards' });
                return;
            }
            const { rewardProgramId, name, description, type, value, isActive } = req.body;
            if (!businessId || !rewardProgramId || !name || !type || value === undefined) {
                res.status(400).json({ error: 'businessId, rewardProgramId, name, type, and value are required' });
                return;
            }
            const reward = await Reward.create({ businessId, rewardProgramId, name, description, type, value, isActive });
            res.status(201).json(reward);
        } catch (error) {
            logger(`Error creating reward: ${error}`);
            res.status(500).json({ error: 'Internal server error' });
        }
    };

    public static update: RequestHandler = async (req, res) => {
        try {
            const { id } = req.params;
            // @ts-ignore
            const { role, businessId } = req.user || {};
            const reward = await Reward.findByPk(id);
            if (!reward) {
                res.status(404).json({ error: 'Reward not found' });
                return;
            }
            if (role !== 'business_owner' || reward.businessId !== businessId) {
                res.status(403).json({ error: 'Only the business owner can update this reward' });
                return;
            }
            const { name, description, type, value, isActive } = req.body;
            await reward.update({ name, description, type, value, isActive });
            res.json(reward);
        } catch (error) {
            logger(`Error updating reward: ${error}`);
            res.status(500).json({ error: 'Internal server error' });
        }
    };

    public static delete: RequestHandler = async (req, res) => {
        try {
            const { id } = req.params;
            // @ts-ignore
            const { role, businessId } = req.user || {};
            const reward = await Reward.findByPk(id);
            if (!reward) {
                res.status(404).json({ error: 'Reward not found' });
                return;
            }
            if (role !== 'business_owner' || reward.businessId !== businessId) {
                res.status(403).json({ error: 'Only the business owner can delete this reward' });
                return;
            }
            await reward.destroy();
            res.json({ message: 'Reward deleted successfully' });
        } catch (error) {
            logger(`Error deleting reward: ${error}`);
            res.status(500).json({ error: 'Internal server error' });
        }
    };
} 