module.exports = {
  verbose: true,
  testURL: "http://localhost/",
  collectCoverage: true,
  globals: {
    ZAFClient: {
      init: () => {}
    }
  },
  roots: ['./spec']
}
