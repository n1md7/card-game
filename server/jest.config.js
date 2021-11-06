module.exports = {
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.+(ts|tsx|js)', '**/?(*.)+(spec|test).+(ts|tsx|js)'],
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.tsx?$': 'ts-jest',
  },
  coveragePathIgnorePatterns: ['src/middleware'],
  coverageDirectory: "../reports/server",
  reporters: [
    "default", ["jest-junit", {
      "suiteName": "Server unit tests",
      "outputDirectory": "<rootDir>/../reports/server",
      "outputName": "junit.xml",
    }]
  ],
  "coverageReporters": ["json", "lcov", "text", "text-summary", "clover", "cobertura"]
};
