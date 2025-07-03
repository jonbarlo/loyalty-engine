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
}); 