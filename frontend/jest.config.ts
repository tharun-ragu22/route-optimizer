import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
});

const config: Config = {
  // Use jsdom for UI tests
  testEnvironment: 'jsdom',
  
  // Clear mocks automatically between tests
  clearMocks: true,

  // Enable coverage with the v8 provider you selected earlier
  collectCoverage: true,
  coverageProvider: 'v8',
  coverageDirectory: 'coverage',

  // If you create a jest.setup.ts file for custom matchers, link it here:
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};

export default createJestConfig(config);