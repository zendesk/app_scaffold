/**
 * Default jest configurations
 */

module.exports = {
  verbose: true,
  testURL: 'http://localhost/',
  collectCoverage: true,
  globals: {
    ZAFClient: {
      init: () => {}
    }
  }
}
