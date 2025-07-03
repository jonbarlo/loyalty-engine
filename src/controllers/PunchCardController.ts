import { Request, Response, RequestHandler } from 'express';
import PunchCard from '../models/PunchCardModel';
import { logger } from '../utils/logger';
import RewardProgram from '../models/RewardProgramModel';

export class PunchCardController {
    public static getAll: RequestHandler = async (req, res) => {
        try {
            // @ts-ignore
            const { role, userId, businessId } = req.user || {};
            let punchCards;
            if (role === 'business_owner') {
                punchCards = await PunchCard.findAll({ where: { businessId } });
            } else {
                punchCards = await PunchCard.findAll({ where: { userId } });
            }
            res.json(punchCards);
        } catch (error) {
            logger(`Error getting punch cards: ${error}`);
            res.status(500).json({ error: 'Internal server error' });
        }
    };

    public static getById: RequestHandler = async (req, res) => {
        try {
            const { id } = req.params;
            const punchCard = await PunchCard.findByPk(id);
            if (!punchCard) {
                res.status(404).json({ error: 'Punch card not found' });
                return;
            }
            res.json(punchCard);
        } catch (error) {
            logger(`Error getting punch card by ID: ${error}`);
            res.status(500).json({ error: 'Internal server error' });
        }
    };

    public static create: RequestHandler = async (req, res) => {
        try {
            // @ts-ignore
            const { role, userId, businessId } = req.user || {};
            let createUserId = userId;
            let createBusinessId = businessId;
            if (role === 'business_owner') {
                createBusinessId = businessId;
                createUserId = req.body.userId || userId;
            }
            if (role === 'customer') {
                createUserId = userId;
                createBusinessId = businessId;
            }
            const { rewardProgramId, punches, redeemed } = req.body;
            if (!createUserId || !createBusinessId || !rewardProgramId) {
                res.status(400).json({ error: 'userId, businessId, and rewardProgramId are required' });
                return;
            }
            const punchCard = await PunchCard.create({ userId: createUserId, businessId: createBusinessId, rewardProgramId, punches: punches || 0, redeemed: redeemed || false });
            res.status(201).json(punchCard);
        } catch (error) {
            logger(`Error creating punch card: ${error}`);
            res.status(500).json({ error: 'Internal server error' });
        }
    };

    public static update: RequestHandler = async (req, res) => {
        try {
            const { id } = req.params;
            const punchCard = await PunchCard.findByPk(id);
            if (!punchCard) {
                res.status(404).json({ error: 'Punch card not found' });
                return;
            }
            const { punches, redeemed } = req.body;
            await punchCard.update({ punches, redeemed });
            res.json(punchCard);
        } catch (error) {
            logger(`Error updating punch card: ${error}`);
            res.status(500).json({ error: 'Internal server error' });
        }
    };

    public static delete: RequestHandler = async (req, res) => {
        try {
            const { id } = req.params;
            const punchCard = await PunchCard.findByPk(id);
            if (!punchCard) {
                res.status(404).json({ error: 'Punch card not found' });
                return;
            }
            await punchCard.destroy();
            res.json({ message: 'Punch card deleted successfully' });
        } catch (error) {
            logger(`Error deleting punch card: ${error}`);
            res.status(500).json({ error: 'Internal server error' });
        }
    };

    // Earn a punch (increment punches)
    public static earnPunch: RequestHandler = async (req, res) => {
        try {
            const { id } = req.params;
            // @ts-ignore
            const { userId, role } = req.user || {};
            const punchCard = await PunchCard.findByPk(id);
            if (!punchCard) {
                res.status(404).json({ error: 'Punch card not found' });
                return;
            }
            if (role === 'customer' && punchCard.userId !== userId) {
                res.status(403).json({ error: 'Forbidden' });
                return;
            }
            const rewardProgram = await RewardProgram.findByPk(punchCard.rewardProgramId);
            const maxPunches = (rewardProgram?.config as any)?.maxPunches || 10;
            if (punchCard.punches >= maxPunches) {
                res.status(400).json({ error: 'Punch card is already full' });
                return;
            }
            punchCard.punches += 1;
            await punchCard.save();
            res.json(punchCard);
        } catch (error) {
            logger(`Error earning punch: ${error}`);
            res.status(500).json({ error: 'Internal server error' });
        }
    };

    // Redeem a punch card
    public static redeem: RequestHandler = async (req, res) => {
        try {
            const { id } = req.params;
            // @ts-ignore
            const { userId, role } = req.user || {};
            const punchCard = await PunchCard.findByPk(id);
            if (!punchCard) {
                res.status(404).json({ error: 'Punch card not found' });
                return;
            }
            if (role === 'customer' && punchCard.userId !== userId) {
                res.status(403).json({ error: 'Forbidden' });
                return;
            }
            const rewardProgram = await RewardProgram.findByPk(punchCard.rewardProgramId);
            const maxPunches = (rewardProgram?.config as any)?.maxPunches || 10;
            if (punchCard.punches < maxPunches) {
                res.status(400).json({ error: 'Not enough punches to redeem' });
                return;
            }
            if (punchCard.redeemed) {
                res.status(400).json({ error: 'Punch card already redeemed' });
                return;
            }
            punchCard.redeemed = true;
            await punchCard.save();
            res.json(punchCard);
        } catch (error) {
            logger(`Error redeeming punch card: ${error}`);
            res.status(500).json({ error: 'Internal server error' });
        }
    };

    public static getMine: RequestHandler = async (req, res) => {
        try {
            // @ts-ignore
            const { userId } = req.user || {};
            const punchCards = await PunchCard.findAll({ where: { userId } });
            res.json(punchCards);
        } catch (error) {
            logger(`Error getting my punch cards: ${error}`);
            res.status(500).json({ error: 'Internal server error' });
        }
    };
} 