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
}); 