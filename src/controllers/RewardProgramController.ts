import { Request, Response, RequestHandler } from 'express';
import RewardProgram from '../models/RewardProgramModel';
import { logger } from '../utils/logger';

export class RewardProgramController {
    public static getAll: RequestHandler = async (req, res) => {
        try {
            // @ts-ignore
            const { role, businessId } = req.user || {};
            let programs;
            if (role === 'business_owner') {
                programs = await RewardProgram.findAll({ where: { businessId } });
            } else {
                programs = await RewardProgram.findAll();
            }
            res.json(programs);
        } catch (error) {
            logger(`Error getting reward programs: ${error}`);
            res.status(500).json({ error: 'Internal server error' });
        }
    };

    public static getById: RequestHandler = async (req, res) => {
        try {
            const { id } = req.params;
            const program = await RewardProgram.findByPk(id);
            if (!program) {
                res.status(404).json({ error: 'Reward program not found' });
                return;
            }
            res.json(program);
        } catch (error) {
            logger(`Error getting reward program by ID: ${error}`);
            res.status(500).json({ error: 'Internal server error' });
        }
    };

    public static create: RequestHandler = async (req, res) => {
        try {
            // @ts-ignore
            const { role, businessId } = req.user || {};
            if (role !== 'business_owner') {
                res.status(403).json({ error: 'Only business owners can create reward programs' });
                return;
            }
            const { type, name, description, config, isActive } = req.body;
            if (!businessId || !type || !name || !config) {
                res.status(400).json({ error: 'businessId, type, name, and config are required' });
                return;
            }
            const program = await RewardProgram.create({ businessId, type, name, description, config, isActive });
            res.status(201).json(program);
        } catch (error) {
            logger(`Error creating reward program: ${error}`);
            res.status(500).json({ error: 'Internal server error' });
        }
    };

    public static update: RequestHandler = async (req, res) => {
        try {
            const { id } = req.params;
            // @ts-ignore
            const { role, businessId } = req.user || {};
            const program = await RewardProgram.findByPk(id);
            if (!program) {
                res.status(404).json({ error: 'Reward program not found' });
                return;
            }
            if (role !== 'business_owner' || program.businessId !== businessId) {
                res.status(403).json({ error: 'Only the business owner can update this reward program' });
                return;
            }
            const { type, name, description, config, isActive } = req.body;
            await program.update({ type, name, description, config, isActive });
            res.json(program);
        } catch (error) {
            logger(`Error updating reward program: ${error}`);
            res.status(500).json({ error: 'Internal server error' });
        }
    };

    public static delete: RequestHandler = async (req, res) => {
        try {
            const { id } = req.params;
            // @ts-ignore
            const { role, businessId } = req.user || {};
            const program = await RewardProgram.findByPk(id);
            if (!program) {
                res.status(404).json({ error: 'Reward program not found' });
                return;
            }
            if (role !== 'business_owner' || program.businessId !== businessId) {
                res.status(403).json({ error: 'Only the business owner can delete this reward program' });
                return;
            }
            await program.destroy();
            res.json({ message: 'Reward program deleted successfully' });
        } catch (error) {
            logger(`Error deleting reward program: ${error}`);
            res.status(500).json({ error: 'Internal server error' });
        }
    };
} 