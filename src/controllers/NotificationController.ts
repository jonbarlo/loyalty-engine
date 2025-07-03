import { Request, Response, RequestHandler } from 'express';
import Notification from '../models/NotificationModel';
import { logger } from '../utils/logger';

export class NotificationController {
    public static getAll: RequestHandler = async (req, res) => {
        try {
            // @ts-ignore
            const { userId } = req.user || {};
            const notifications = await Notification.findAll({ where: { userId } });
            res.json(notifications);
        } catch (error) {
            logger(`Error getting notifications: ${error}`);
            res.status(500).json({ error: 'Internal server error' });
        }
    };

    public static getById: RequestHandler = async (req, res) => {
        try {
            const { id } = req.params;
            const notification = await Notification.findByPk(id);
            if (!notification) {
                res.status(404).json({ error: 'Notification not found' });
                return;
            }
            res.json(notification);
        } catch (error) {
            logger(`Error getting notification by ID: ${error}`);
            res.status(500).json({ error: 'Internal server error' });
        }
    };

    public static create: RequestHandler = async (req, res) => {
        try {
            const { userId, businessId, message, type, isRead } = req.body;
            if (!userId || !businessId || !message || !type) {
                res.status(400).json({ error: 'userId, businessId, message, and type are required' });
                return;
            }
            const notification = await Notification.create({ userId, businessId, message, type, isRead: isRead || false });
            res.status(201).json(notification);
        } catch (error) {
            logger(`Error creating notification: ${error}`);
            res.status(500).json({ error: 'Internal server error' });
        }
    };

    public static update: RequestHandler = async (req, res) => {
        try {
            const { id } = req.params;
            const notification = await Notification.findByPk(id);
            if (!notification) {
                res.status(404).json({ error: 'Notification not found' });
                return;
            }
            const { message, isRead } = req.body;
            await notification.update({ message, isRead });
            res.json(notification);
        } catch (error) {
            logger(`Error updating notification: ${error}`);
            res.status(500).json({ error: 'Internal server error' });
        }
    };

    public static delete: RequestHandler = async (req, res) => {
        try {
            const { id } = req.params;
            const notification = await Notification.findByPk(id);
            if (!notification) {
                res.status(404).json({ error: 'Notification not found' });
                return;
            }
            await notification.destroy();
            res.json({ message: 'Notification deleted successfully' });
        } catch (error) {
            logger(`Error deleting notification: ${error}`);
            res.status(500).json({ error: 'Internal server error' });
        }
    };

    public static markAsRead: RequestHandler = async (req, res) => {
        try {
            const { id } = req.params;
            // @ts-ignore
            const { userId } = req.user || {};
            const notification = await Notification.findByPk(id);
            if (!notification) {
                res.status(404).json({ error: 'Notification not found' });
                return;
            }
            if (notification.userId !== userId) {
                res.status(403).json({ error: 'Forbidden' });
                return;
            }
            notification.isRead = true;
            await notification.save();
            res.json(notification);
        } catch (error) {
            logger(`Error marking notification as read: ${error}`);
            res.status(500).json({ error: 'Internal server error' });
        }
    };

    public static getMine: RequestHandler = async (req, res) => {
        try {
            // @ts-ignore
            const { userId } = req.user || {};
            const notifications = await Notification.findAll({ where: { userId } });
            res.json(notifications);
        } catch (error) {
            logger(`Error getting my notifications: ${error}`);
            res.status(500).json({ error: 'Internal server error' });
        }
    };
} 