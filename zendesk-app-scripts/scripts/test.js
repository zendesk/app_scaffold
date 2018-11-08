/**
 * Exectutor for "zendesk-app-scripts test" command
 * Resolve with logs when test complete(either fail or pass)
 * NOTE: Jest config options(https://jestjs.io/docs/en/configuration) VS Jest CLI options(https://jestjs.io/docs/en/cli)
 *
 */

'use strict'

const path = require('path')
const chalk = require('chalk')
const jestFn = require('jest')

module.exports = (flags = {}, resolve, reject) => {
  // Ignore config file path, we only check custom jest config options in project package.json
  delete flags.config
  delete flags.c

  const logs = []
  const options = []

  // Get custom config options from package.json in the app project
  // If exists, merge with default config options
  let customJestConfig = require(`${process.cwd()}/package.json`).jest
  let jestConfig = require(path.resolve(__dirname, '../config/jest.config.js'))
  if (typeof customJestConfig === 'object') {
    logs.push(`${chalk.green('log:')} Custom jest configurations from package.json is merged`)
    Object.assign(jestConfig, customJestConfig)
  }

  // Convert config options to JSON string, add to options object
  options.push(`--config`, JSON.stringify(jestConfig))

  // Add CLI options to options object
  // {'watch': true} => ['--watch'], true is ignored
  // {'outputFile': 'results'} => ['--outputFile', 'results'], both key/value is preserved
  Object.keys(flags).forEach((key) => {
    options.push(`--${key}`)
    if(typeof flags[key] === 'string') {
      options.push(flags[key])
    }
  })

  logs.push(`${chalk.green('log:')} Test Complete`)

  resolve(jestFn.run(options).then(() => logs.join('\n')))
}
