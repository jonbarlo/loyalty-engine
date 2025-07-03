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
    const mockReward = { update: jest.fn().mockResolvedValue({ id: 1 }), id: 1 };
    (Reward.findByPk as jest.Mock).mockResolvedValue(mockReward);
    const res = await request(app).put('/rewards/1').set('Authorization', 'Bearer mocked.jwt.token').send({ name: 'Updated' });
    expect(res.status).toBe(200);
  });
  it('should delete a reward', async () => {
    const mockReward = { destroy: jest.fn().mockResolvedValue(true), id: 1 };
    (Reward.findByPk as jest.Mock).mockResolvedValue(mockReward);
    const res = await request(app).delete('/rewards/1').set('Authorization', 'Bearer mocked.jwt.token');
    expect(res.status).toBe(200);
  });
}); 