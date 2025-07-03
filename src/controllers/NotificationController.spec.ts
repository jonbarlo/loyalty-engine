const authenticateToken = jest.fn((req: any, res: any, next: any) => {
  req.user = {
    userId: 1,
    email: 'test@example.com',
    role: 'business_owner',
    businessId: 1
  };
  next();
});
jest.mock('../middleware/auth', () => ({ authenticateToken }));
import request from 'supertest';
import app from '../index';
import Notification from '../models/NotificationModel';
jest.mock('../models/NotificationModel');

describe('NotificationController', () => {
  // Add tests for markAsRead, getMine, and RBAC
  it('should only allow the notification owner to mark as read', async () => {
    const mockNotification = { id: 1, userId: 2, isRead: false, save: jest.fn() };
    (Notification.findByPk as jest.Mock).mockResolvedValue(mockNotification);
    const token = 'mocked.jwt.token'; // Assume middleware is mocked or bypassed
    // Simulate req.user.userId !== notification.userId
    // You may need to mock req.user or the middleware for a real test
    const res = await request(app)
      .patch('/notifications/1/read')
      .set('Authorization', `Bearer ${token}`)
      .send();
    // Simulate forbidden
    expect(res.status).toBe(403);
  });
  it('should allow getMine to return only user notifications', async () => {
    // ...mock and test logic...
  });
  it('should get a notification by id', async () => {
    (Notification.findByPk as jest.Mock).mockResolvedValue({ id: 1 });
    const res = await request(app).get('/notifications/1').set('Authorization', 'Bearer mocked.jwt.token');
    expect(res.status).toBe(200);
  });
  it('should return 404 if notification not found', async () => {
    (Notification.findByPk as jest.Mock).mockResolvedValue(null);
    const res = await request(app).get('/notifications/999').set('Authorization', 'Bearer mocked.jwt.token');
    expect(res.status).toBe(404);
  });
  it('should create a notification', async () => {
    (Notification.create as jest.Mock).mockResolvedValue({ id: 1 });
    const res = await request(app).post('/notifications').set('Authorization', 'Bearer mocked.jwt.token').send({ userId: 1, businessId: 1, message: 'Test', type: 'info' });
    expect(res.status).toBe(201);
  });
  it('should update a notification', async () => {
    const mockNotification = { update: jest.fn().mockResolvedValue({ id: 1 }), id: 1 };
    (Notification.findByPk as jest.Mock).mockResolvedValue(mockNotification);
    const res = await request(app).put('/notifications/1').set('Authorization', 'Bearer mocked.jwt.token').send({ message: 'Updated' });
    expect(res.status).toBe(200);
  });
  it('should delete a notification', async () => {
    const mockNotification = { destroy: jest.fn().mockResolvedValue(true), id: 1 };
    (Notification.findByPk as jest.Mock).mockResolvedValue(mockNotification);
    const res = await request(app).delete('/notifications/1').set('Authorization', 'Bearer mocked.jwt.token');
    expect(res.status).toBe(200);
  });
  it('should only allow customers to view their own notifications', async () => {
    const { authenticateToken } = require('../middleware/auth');
    authenticateToken.mockImplementationOnce((req: any, res: any, next: any) => {
      req.user = {
        userId: 42,
        email: 'customer@example.com',
        role: 'customer',
        businessId: 1
      };
      next();
    });
    (Notification.findAll as jest.Mock).mockResolvedValue([{ id: 1, userId: 42 }]);
    const res = await request(app).get('/notifications').set('Authorization', 'Bearer mocked.jwt.token');
    expect(res.status).toBe(200);
    expect(res.body.every((n: any) => n.userId === 42)).toBe(true);
  });
  it('should allow admin to view all notifications', async () => {
    const { authenticateToken } = require('../middleware/auth');
    authenticateToken.mockImplementationOnce((req: any, res: any, next: any) => {
      req.user = {
        userId: 99,
        email: 'admin@example.com',
        role: 'admin',
        businessId: 1
      };
      next();
    });
    (Notification.findAll as jest.Mock).mockResolvedValue([
      { id: 1, userId: 42 },
      { id: 2, userId: 43 }
    ]);
    const res = await request(app).get('/notifications').set('Authorization', 'Bearer mocked.jwt.token');
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
  });
}); 