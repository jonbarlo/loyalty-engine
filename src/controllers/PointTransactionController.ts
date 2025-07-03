import { Request, Response, RequestHandler } from 'express';
import PointTransaction from '../models/PointTransactionModel';
import { logger } from '../utils/logger';

export class PointTransactionController {
    public static getAll: RequestHandler = async (req, res) => {
        try {
            // @ts-ignore
            const { role, userId, businessId } = req.user || {};
            let transactions;
            if (role === 'business_owner') {
                transactions = await PointTransaction.findAll({ where: { businessId } });
            } else {
                transactions = await PointTransaction.findAll({ where: { userId } });
            }
            res.json(transactions);
        } catch (error) {
            logger(`Error getting point transactions: ${error}`);
            res.status(500).json({ error: 'Internal server error' });
        }
    };

    public static getById: RequestHandler = async (req, res) => {
        try {
            const { id } = req.params;
            const transaction = await PointTransaction.findByPk(id);
            if (!transaction) {
                res.status(404).json({ error: 'Point transaction not found' });
                return;
            }
            res.json(transaction);
        } catch (error) {
            logger(`Error getting point transaction by ID: ${error}`);
            res.status(500).json({ error: 'Internal server error' });
        }
    };

    public static create: RequestHandler = async (req, res) => {
        try {
            const { userId, businessId, rewardProgramId, points, type, description } = req.body;
            if (!userId || !businessId || !rewardProgramId || !points || !type) {
                res.status(400).json({ error: 'userId, businessId, rewardProgramId, points, and type are required' });
                return;
            }
            const transaction = await PointTransaction.create({ userId, businessId, rewardProgramId, points, type, description });
            res.status(201).json(transaction);
        } catch (error) {
            logger(`Error creating point transaction: ${error}`);
            res.status(500).json({ error: 'Internal server error' });
        }
    };

    public static update: RequestHandler = async (req, res) => {
        try {
            const { id } = req.params;
            const transaction = await PointTransaction.findByPk(id);
            if (!transaction) {
                res.status(404).json({ error: 'Point transaction not found' });
                return;
            }
            const { points, type, description } = req.body;
            await transaction.update({ points, type, description });
            res.json(transaction);
        } catch (error) {
            logger(`Error updating point transaction: ${error}`);
            res.status(500).json({ error: 'Internal server error' });
        }
    };

    public static delete: RequestHandler = async (req, res) => {
        try {
            const { id } = req.params;
            const transaction = await PointTransaction.findByPk(id);
            if (!transaction) {
                res.status(404).json({ error: 'Point transaction not found' });
                return;
            }
            await transaction.destroy();
            res.json({ message: 'Point transaction deleted successfully' });
        } catch (error) {
            logger(`Error deleting point transaction: ${error}`);
            res.status(500).json({ error: 'Internal server error' });
        }
    };

    // Earn points (add a transaction of type 'earn')
    public static earnPoints: RequestHandler = async (req, res) => {
        try {
            const { userId, businessId, rewardProgramId, points, description } = req.body;
            if (!userId || !businessId || !rewardProgramId || !points) {
                res.status(400).json({ error: 'userId, businessId, rewardProgramId, and points are required' });
                return;
            }
            const transaction = await PointTransaction.create({ userId, businessId, rewardProgramId, points, type: 'earn', description });
            res.status(201).json(transaction);
        } catch (error) {
            logger(`Error earning points: ${error}`);
            res.status(500).json({ error: 'Internal server error' });
        }
    };

    // Spend points (add a transaction of type 'spend')
    public static spendPoints: RequestHandler = async (req, res) => {
        try {
            // @ts-ignore
            const { userId, role } = req.user || {};
            const { businessId, rewardProgramId, points, description } = req.body;
            // Only allow spending for self if customer
            if (role === 'customer' && req.body.userId && req.body.userId !== userId) {
                res.status(403).json({ error: 'Forbidden' });
                return;
            }
            // Assume getUserPoints is a helper that returns total points for user in program
            const getUserPoints = async (userId: number, rewardProgramId: number) => 1000; // TODO: implement real logic
            const currentPoints = await getUserPoints(userId, rewardProgramId);
            if (points > currentPoints) {
                res.status(400).json({ error: 'Not enough points' });
                return;
            }
            const transaction = await PointTransaction.create({ userId, businessId, rewardProgramId, points, type: 'spend', description });
            res.status(201).json(transaction);
        } catch (error) {
            logger(`Error spending points: ${error}`);
            res.status(500).json({ error: 'Internal server error' });
        }
    };
} 