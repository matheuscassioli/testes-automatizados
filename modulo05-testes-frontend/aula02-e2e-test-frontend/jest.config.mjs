/**
 * For a detailed explanation regarding each configuration property, visit:
 */

/** @type {import('jest').Config} */
const config = {
  clearMocks: true,
  coverageProvider: "v8",
  collectCoverage: true,
  testEnvironment:'jsdom'
};

export default config;
