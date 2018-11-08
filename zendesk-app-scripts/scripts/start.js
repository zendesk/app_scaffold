/**
 * Exectutor for "zendesk-app-scripts start" command
 * Resolve with logs after "zat server" is terminated
 */

'use strict'
const spawn = require('cross-spawn')
const chalk = require('chalk')

module.exports = (flags = {}, resolve, reject) => {
  const path = flags.p || flags.path || './dist'
  const result = spawn.sync('zat', ['server', '-p', path], { stdio: 'inherit' })

  resolve(`${chalk.green('log:')} ZAT server Shuts down with exit code ${result.status}`)
}
