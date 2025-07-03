import request from 'supertest';
import app from '../index';
import PointTransaction from '../models/PointTransactionModel';

jest.mock('../models/PointTransactionModel');

describe('PointTransactionController', () => {
  // Add tests for RBAC, spendPoints logic, and getMine endpoint
  it('should only allow business owners to view all transactions', async () => {
    // ...mock and test logic...
  });
  it('should only allow customers to view their own transactions', async () => {
    // ...mock and test logic...
  });
  it('should not allow spending more points than user has', async () => {
    // ...mock and test logic...
  });
  it('should allow getMine to return only user transactions', async () => {
    // ...mock and test logic...
  });
  it('should get a point transaction by id', async () => {
    (PointTransaction.findByPk as jest.Mock).mockResolvedValue({ id: 1 });
    const res = await request(app).get('/point-transactions/1').set('Authorization', 'Bearer mocked.jwt.token');
    expect(res.status).toBe(200);
  });
  it('should return 404 if point transaction not found', async () => {
    (PointTransaction.findByPk as jest.Mock).mockResolvedValue(null);
    const res = await request(app).get('/point-transactions/999').set('Authorization', 'Bearer mocked.jwt.token');
    expect(res.status).toBe(404);
  });
  it('should create a point transaction', async () => {
    (PointTransaction.create as jest.Mock).mockResolvedValue({ id: 1 });
    const res = await request(app).post('/point-transactions').set('Authorization', 'Bearer mocked.jwt.token').send({ rewardProgramId: 1, points: 10, type: 'earn' });
    expect(res.status).toBe(201);
  });
  it('should update a point transaction', async () => {
    const mockTransaction = { update: jest.fn().mockResolvedValue({ id: 1 }), id: 1 };
    (PointTransaction.findByPk as jest.Mock).mockResolvedValue(mockTransaction);
    const res = await request(app).put('/point-transactions/1').set('Authorization', 'Bearer mocked.jwt.token').send({ points: 5 });
    expect(res.status).toBe(200);
  });
  it('should delete a point transaction', async () => {
    const mockTransaction = { destroy: jest.fn().mockResolvedValue(true), id: 1 };
    (PointTransaction.findByPk as jest.Mock).mockResolvedValue(mockTransaction);
    const res = await request(app).delete('/point-transactions/1').set('Authorization', 'Bearer mocked.jwt.token');
    expect(res.status).toBe(200);
  });
}); 