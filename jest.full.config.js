module.exports = {
    testEnvironment: "node",
    transform: {
      "^.+\\.(js|jsx)$": "babel-jest",
    },
    collectCoverageFrom: [
      "**/*.{js,jsx}",
      "!**/node_modules/**",
      "!**/vendor/**"
    ],
    coverageThreshold: {
      global: {
        branches: 100,
        functions: 100,
        lines: 100,
        statements: 100
      }
    },
  };