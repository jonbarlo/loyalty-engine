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
}); 