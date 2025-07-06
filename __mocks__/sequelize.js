class MockModel {
  static init() {}
  static belongsTo() {}
  static hasMany() {}
  static hasOne() {}
  static associate() {}
}

const mockType = (type) => (...args) => ({ type, args });

module.exports = {
  Model: MockModel,
  DataTypes: {
    INTEGER: mockType('INTEGER'),
    STRING: mockType('STRING'),
    TEXT: mockType('TEXT'),
    ENUM: (...args) => ({ type: 'ENUM', values: args }),
    DECIMAL: mockType('DECIMAL'),
    DATE: mockType('DATE'),
    BOOLEAN: mockType('BOOLEAN'),
  },
  Op: {},
  literal: jest.fn(),
  fn: jest.fn(),
  col: jest.fn(),
  where: jest.fn(),
}; 