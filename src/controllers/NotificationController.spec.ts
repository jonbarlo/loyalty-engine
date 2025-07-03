import request from 'supertest';
import app from '../index';
import Notification from '../models/NotificationModel';

jest.mock('../models/NotificationModel');

describe('NotificationController', () => {
  // Add tests for markAsRead, getMine, and RBAC
  it('should only allow the notification owner to mark as read', async () => {
    // ...mock and test logic...
  });
  it('should allow getMine to return only user notifications', async () => {
    // ...mock and test logic...
  });
}); 