module.exports = {
  verbose: true,
  collectCoverage: true,
  globals: {
    ZAFClient: {
      init: () => {}
    }
  },
  roots: ['./spec'],
  moduleNameMapper: {
    "\\.(css|less)$": "<rootDir>/spec/mocks/styleMock.js"
  }
}
