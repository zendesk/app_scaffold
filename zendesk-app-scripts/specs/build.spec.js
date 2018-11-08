/* eslint-env jest */
const mockWebpack = require('webpack')
const mockChalk = require('chalk')
const mockPackageJson = require('../package.json')
const buildScript = require('../scripts/build')

jest.mock('webpack')
// these mock is required by mini-css-extrac-plugin
mockWebpack.Dependency = function(){}
mockWebpack.Module = function(){}
let mockError, mockStats
mockWebpack.mockImplementation(
  (configObject, cb) => {
    cb(mockError, mockStats)
  }
)

jest.mock('chalk')
mockChalk.green = jest.fn().mockImplementation(input => input)
mockChalk.yellow = jest.fn().mockImplementation(input => input)

jest.mock('../package.json')
mockPackageJson.babel = {}
mockPackageJson.postcss = {}

jest.mock('../customWebpackConfig.js', () => {}, { virtual: true })
jest.mock('../bundles.js', () => [], { virtual: true })

describe('Build Script', () => {
  it('should return correct log messages when build succeed without custom config', async (done) => {
    mockStats = {
      toJson: () => ({ errors: [], warnings: [] }),
      hasErrors: () => {},
      hasWarnings: () => {}
    }
    mockError = undefined

    const buildScriptBindWithFlags = buildScript.bind(null, {})
    const message = await new Promise(buildScriptBindWithFlags)
    expect(message).toBe('log: Build Complete')
    done()
  })

  it('should return correct log messages when build succeed with custom config', async (done) => {
    mockStats = {
      toJson: () => ({ errors: [], warnings: [] }),
      hasErrors: () => {},
      hasWarnings: () => {}
    }
    mockError = undefined

    const buildScriptBindWithFlags = buildScript.bind(null, { dev: true, config: './customWebpackConfig.js' })
    const message = await new Promise(buildScriptBindWithFlags)
    expect(message).toBe('log: ./customWebpackConfig.js is used instead of default webpack config\nlog: Build Complete')
    done()
  })

  it('should return correct log messages when build failed with fatal webpack errors', async (done) => {
    mockStats = {
      toJson: () => ({ errors: [], warnings: [] }),
      hasErrors: () => {},
      hasWarnings: () => {}
    }
    mockError = 'Mock Error Message'

    const buildScriptBindWithFlags = buildScript.bind(null, {})
    new Promise(buildScriptBindWithFlags).catch((error) => {
      expect(error.message).toBe('Mock Error Message')
      done()
    })
  })

  it('should return correct log messages when build failed with compilation errors', async (done) => {
    mockStats = {
      toJson: () => ({ errors: ['Mock error 1', 'Mock error 2'], warnings: [] }),
      hasErrors: () => true,
      hasWarnings: () => {}
    }
    mockError = undefined

    const buildScriptBindWithFlags = buildScript.bind(null, {})
    new Promise(buildScriptBindWithFlags).catch((error) => {
      expect(error.message).toBe('Mock error 1\nMock error 2')
      done()
    })
  })

  it('should return correct log messages when build succeed with compilation warnings', async (done) => {
    mockStats = {
      toJson: () => ({ errors: [], warnings: ['Mock warning 1', 'Mock warning 2'] }),
      hasErrors: () => {},
      hasWarnings: () => true
    }
    mockError = undefined

    const buildScriptBindWithFlags = buildScript.bind(null, {})
    const message = await new Promise(buildScriptBindWithFlags)
    expect(message).toBe('warning: Mock warning 1\nMock warning 2\nlog: Build Complete')
    done()
  })
})
