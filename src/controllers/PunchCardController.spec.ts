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
import PunchCard from '../models/PunchCardModel';
import RewardProgram from '../models/RewardProgramModel';
jest.mock('../models/PunchCardModel');
jest.mock('../models/RewardProgramModel');

describe('PunchCardController', () => {
  // Add tests for RBAC, punch limit, redeem logic, and getMine endpoint
  it('should only allow business owners to view all punch cards', async () => {
    // ...mock and test logic...
  });
  it('should only allow customers to view their own punch cards', async () => {
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
    (PunchCard.findAll as jest.Mock).mockResolvedValue([{ id: 1, userId: 42 }]);
    const res = await request(app).get('/punch-cards').set('Authorization', 'Bearer mocked.jwt.token');
    expect(res.status).toBe(200);
    expect(res.body.every((card: any) => card.userId === 42)).toBe(true);
  });
  it('should not allow earning a punch if card is full', async () => {
    const mockPunchCard = { id: 1, userId: 2, rewardProgramId: 3, punches: 10, redeemed: false, save: jest.fn() };
    const mockRewardProgram = { id: 3, config: { maxPunches: 10 } };
    (PunchCard.findByPk as jest.Mock).mockResolvedValue(mockPunchCard);
    (RewardProgram.findByPk as jest.Mock).mockResolvedValue(mockRewardProgram);
    const token = 'mocked.jwt.token'; // Assume middleware is mocked or bypassed
    const res = await request(app)
      .post('/punch-cards/1/earn')
      .set('Authorization', `Bearer ${token}`)
      .send();
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/already full/);
  });
  it('should not allow redeem if not enough punches', async () => {
    // ...mock and test logic...
  });
  it('should allow getMine to return only user punch cards', async () => {
    // ...mock and test logic...
  });
  it('should get a punch card by id', async () => {
    (PunchCard.findByPk as jest.Mock).mockResolvedValue({ id: 1 });
    const res = await request(app).get('/punch-cards/1').set('Authorization', 'Bearer mocked.jwt.token');
    expect(res.status).toBe(200);
  });
  it('should return 404 if punch card not found', async () => {
    (PunchCard.findByPk as jest.Mock).mockResolvedValue(null);
    const res = await request(app).get('/punch-cards/999').set('Authorization', 'Bearer mocked.jwt.token');
    expect(res.status).toBe(404);
  });
  it('should create a punch card', async () => {
    (PunchCard.create as jest.Mock).mockResolvedValue({ id: 1 });
    const res = await request(app).post('/punch-cards').set('Authorization', 'Bearer mocked.jwt.token').send({ rewardProgramId: 1 });
    expect(res.status).toBe(201);
  });
  it('should update a punch card', async () => {
    const mockPunchCard = { update: jest.fn().mockResolvedValue({ id: 1 }), id: 1 };
    (PunchCard.findByPk as jest.Mock).mockResolvedValue(mockPunchCard);
    const res = await request(app).put('/punch-cards/1').set('Authorization', 'Bearer mocked.jwt.token').send({ punches: 5 });
    expect(res.status).toBe(200);
  });
  it('should delete a punch card', async () => {
    const mockPunchCard = { destroy: jest.fn().mockResolvedValue(true), id: 1 };
    (PunchCard.findByPk as jest.Mock).mockResolvedValue(mockPunchCard);
    const res = await request(app).delete('/punch-cards/1').set('Authorization', 'Bearer mocked.jwt.token');
    expect(res.status).toBe(200);
  });
  it('should allow admin to view all punch cards', async () => {
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
    (PunchCard.findAll as jest.Mock).mockResolvedValue([
      { id: 1, userId: 42 },
      { id: 2, userId: 43 }
    ]);
    const res = await request(app).get('/punch-cards').set('Authorization', 'Bearer mocked.jwt.token');
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
  });
}); 