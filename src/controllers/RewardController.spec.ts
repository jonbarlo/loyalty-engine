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
import Reward from '../models/RewardModel';
jest.mock('../models/RewardModel');

describe('RewardController', () => {
  // Add tests for RBAC and getAll filtering
  it('should only allow business owners to create rewards', async () => {
    // ...mock and test logic...
  });
  it('should only allow business owners to update/delete their own rewards', async () => {
    // ...mock and test logic...
  });
  it('should filter getAll by business for business owners', async () => {
    // ...mock and test logic...
  });
  it('should get a reward by id', async () => {
    (Reward.findByPk as jest.Mock).mockResolvedValue({ id: 1 });
    const res = await request(app).get('/rewards/1').set('Authorization', 'Bearer mocked.jwt.token');
    expect(res.status).toBe(200);
  });
  it('should return 404 if reward not found', async () => {
    (Reward.findByPk as jest.Mock).mockResolvedValue(null);
    const res = await request(app).get('/rewards/999').set('Authorization', 'Bearer mocked.jwt.token');
    expect(res.status).toBe(404);
  });
  it('should create a reward', async () => {
    (Reward.create as jest.Mock).mockResolvedValue({ id: 1 });
    const res = await request(app).post('/rewards').set('Authorization', 'Bearer mocked.jwt.token').send({ rewardProgramId: 1, name: 'Reward', type: 'discount', value: 10 });
    expect(res.status).toBe(201);
  });
  it('should update a reward', async () => {
    const mockReward = { 
      update: jest.fn().mockResolvedValue({ id: 1 }), 
      id: 1,
      businessId: 1  // Match the user's businessId
    };
    (Reward.findByPk as jest.Mock).mockResolvedValue(mockReward);
    const res = await request(app).put('/rewards/1').set('Authorization', 'Bearer mocked.jwt.token').send({ name: 'Updated' });
    expect(res.status).toBe(200);
  });
  it('should delete a reward', async () => {
    const mockReward = { 
      destroy: jest.fn().mockResolvedValue(true), 
      id: 1,
      businessId: 1  // Match the user's businessId
    };
    (Reward.findByPk as jest.Mock).mockResolvedValue(mockReward);
    const res = await request(app).delete('/rewards/1').set('Authorization', 'Bearer mocked.jwt.token');
    expect(res.status).toBe(200);
  });
  it('should not allow customers to create rewards', async () => {
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
    const res = await request(app).post('/rewards').set('Authorization', 'Bearer mocked.jwt.token').send({ rewardProgramId: 1, name: 'Reward', type: 'discount', value: 10 });
    expect(res.status).toBe(403);
  });
  it('should allow admin to view all rewards', async () => {
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
    (Reward.findAll as jest.Mock).mockResolvedValue([
      { id: 1, businessId: 1 },
      { id: 2, businessId: 2 }
    ]);
    const res = await request(app).get('/rewards').set('Authorization', 'Bearer mocked.jwt.token');
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
  });
  it('should not allow business_owner to update another business reward', async () => {
    const { authenticateToken } = require('../middleware/auth');
    authenticateToken.mockImplementationOnce((req: any, res: any, next: any) => {
      req.user = {
        userId: 2,
        email: 'owner@example.com',
        role: 'business_owner',
        businessId: 1
      };
      next();
    });
    // Simulate a reward belonging to a different business
    (Reward.findByPk as jest.Mock).mockResolvedValue({ id: 2, businessId: 2 });
    const res = await request(app).put('/rewards/2').set('Authorization', 'Bearer mocked.jwt.token').send({ name: 'Updated' });
    expect(res.status).toBe(403);
  });
}); 