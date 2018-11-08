/* eslint-env jest */
const mockSpawn = require('cross-spawn')
const mockChalk = require('chalk')
const startScript = require('../scripts/start')

jest.mock('cross-spawn')
mockSpawn.sync.mockReturnValue({
  status: 0
});

jest.mock('chalk')
mockChalk.green = jest.fn().mockImplementation(input => input)

describe('Start script', () => {
  it('should return correct log message', async (done) => {
    const startScriptBindWithFlags = startScript.bind(null, {})
    const message = await new Promise(startScriptBindWithFlags)
    expect(message).toBe('log: ZAT server Shuts down with exit code 0')
    done()
  })
})
