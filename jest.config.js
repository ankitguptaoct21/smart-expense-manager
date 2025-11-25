export default {
  testEnvironment: "node",
  setupFiles: ["<rootDir>/tests/jest.setup.js"],
  roots: ["<rootDir>/tests"],
  collectCoverageFrom: [
    "src/**/*.js",
    "!src/server.js",
    "!src/config/**/*.js"
  ],
  coverageDirectory: "coverage",
  transform: {}
};

