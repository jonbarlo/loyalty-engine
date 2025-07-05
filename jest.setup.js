// Jest setup file
process.env.NODE_ENV = 'test';

// Mock console.log to prevent logging during tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Mock database connection for tests
jest.mock('./src/config/database', () => ({
  __esModule: true,
  default: {
    authenticate: jest.fn().mockResolvedValue(true),
    sync: jest.fn().mockResolvedValue(true),
    close: jest.fn().mockResolvedValue(true),
    define: jest.fn(),
  },
}));

// Mock all Sequelize models with proper methods
const createMockModel = () => ({
  init: jest.fn(),
  findOne: jest.fn(),
  findAll: jest.fn(),
  findByPk: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  destroy: jest.fn(),
  save: jest.fn(),
});

jest.mock('./src/models/UserModel', () => ({
  __esModule: true,
  default: createMockModel(),
}));

jest.mock('./src/models/ThemeModel', () => ({
  __esModule: true,
  default: createMockModel(),
}));

jest.mock('./src/models/BusinessModel', () => ({
  __esModule: true,
  default: createMockModel(),
}));

jest.mock('./src/models/RewardProgramModel', () => ({
  __esModule: true,
  default: createMockModel(),
}));

jest.mock('./src/models/RewardModel', () => ({
  __esModule: true,
  default: createMockModel(),
}));

jest.mock('./src/models/PunchCardModel', () => ({
  __esModule: true,
  default: createMockModel(),
}));

jest.mock('./src/models/PointTransactionModel', () => ({
  __esModule: true,
  default: createMockModel(),
}));

jest.mock('./src/models/NotificationModel', () => ({
  __esModule: true,
  default: createMockModel(),
}));

// Mock middleware
jest.mock('./src/middleware/auth', () => ({
  authenticateToken: jest.fn((req, res, next) => {
    req.user = {
      userId: 1,
      email: 'test@example.com',
      role: 'business_owner',
      businessId: 1
    };
    next();
  }),
}));

// Mock logger to prevent logging during tests
jest.mock('./src/utils/logger', () => ({
  logger: jest.fn(),
}));

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
});

// Global teardown
afterAll(async () => {
  // Wait a bit to ensure all async operations complete
  await new Promise(resolve => setTimeout(resolve, 100));
}); 