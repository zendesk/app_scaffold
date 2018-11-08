/* eslint-env jest */
const mockJest = require('jest')
const mockChalk = require('chalk')
const mockPackageJson = require('../package.json')
const testScript = require('../scripts/test')

jest.mock('jest')
mockJest.run.mockResolvedValue('')

jest.mock('chalk')
mockChalk.green = jest.fn().mockImplementation(input => input)

jest.mock('../package.json')

describe('Test Script', () => {
  it('should call jest.run with default configuration and return correct logs', async (done) => {
    mockPackageJson.jest = undefined

    const flags = {
      'watchAll': true
    }

    const testScriptBindWithFlags = testScript.bind(null, flags)

    const message = await new Promise(testScriptBindWithFlags)

    expect(mockJest.run).toHaveBeenCalledWith([
      '--config',
      '{"verbose":true,"testURL":"http://localhost/","collectCoverage":true,"globals":{"ZAFClient":{}}}',
      '--watchAll'
    ])
    expect(message).toBe('log: Test Complete')

    done()
  })

  it('should call jest.run with merged configuration and return correct logs', async (done) => {
    mockPackageJson.jest = {
      verbose: false
    }

    const flags = {
      'outputFile': 'results'
    }

    const testScriptBindWithFlags = testScript.bind(null, flags)

    const message = await new Promise(testScriptBindWithFlags)

    expect(mockJest.run).toHaveBeenCalledWith([
      '--config',
      '{"verbose":false,"testURL":"http://localhost/","collectCoverage":true,"globals":{"ZAFClient":{}}}',
      '--outputFile',
      'results'
    ])
    expect(message).toBe('log: Custom jest configurations from package.json is merged\nlog: Test Complete')

    done()
  })
})
