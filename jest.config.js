module.exports = {
  verbose: true,
  collectCoverage: true,
  globals: {
    ZAFClient: {
      init: () => {}
    }
  },
  roots: ['./spec']
}
