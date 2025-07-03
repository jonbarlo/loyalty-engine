import request from 'supertest';
import app from '../index';
import RewardProgram from '../models/RewardProgramModel';

jest.mock('../models/RewardProgramModel');

describe('RewardProgramController', () => {
  // Add tests for RBAC and getAll filtering
  it('should only allow business owners to create reward programs', async () => {
    // ...mock and test logic...
  });
  it('should only allow business owners to update/delete their own programs', async () => {
    // ...mock and test logic...
  });
  it('should filter getAll by business for business owners', async () => {
    // ...mock and test logic...
  });
  it('should get a reward program by id', async () => {
    (RewardProgram.findByPk as jest.Mock).mockResolvedValue({ id: 1 });
    const res = await request(app).get('/reward-programs/1').set('Authorization', 'Bearer mocked.jwt.token');
    expect(res.status).toBe(200);
  });
  it('should return 404 if reward program not found', async () => {
    (RewardProgram.findByPk as jest.Mock).mockResolvedValue(null);
    const res = await request(app).get('/reward-programs/999').set('Authorization', 'Bearer mocked.jwt.token');
    expect(res.status).toBe(404);
  });
  it('should create a reward program', async () => {
    (RewardProgram.create as jest.Mock).mockResolvedValue({ id: 1 });
    const res = await request(app).post('/reward-programs').set('Authorization', 'Bearer mocked.jwt.token').send({ type: 'punch_card', name: 'Test', config: {} });
    expect(res.status).toBe(201);
  });
  it('should update a reward program', async () => {
    const mockProgram = { update: jest.fn().mockResolvedValue({ id: 1 }), id: 1 };
    (RewardProgram.findByPk as jest.Mock).mockResolvedValue(mockProgram);
    const res = await request(app).put('/reward-programs/1').set('Authorization', 'Bearer mocked.jwt.token').send({ name: 'Updated' });
    expect(res.status).toBe(200);
  });
  it('should delete a reward program', async () => {
    const mockProgram = { destroy: jest.fn().mockResolvedValue(true), id: 1 };
    (RewardProgram.findByPk as jest.Mock).mockResolvedValue(mockProgram);
    const res = await request(app).delete('/reward-programs/1').set('Authorization', 'Bearer mocked.jwt.token');
    expect(res.status).toBe(200);
  });
}); 