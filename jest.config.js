/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts'],  
  moduleFileExtensions: ['ts', 'js'],
  roots: ['<rootDir>/tests'],            
  clearMocks: true
};
