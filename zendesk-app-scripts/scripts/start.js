'use strict'
const spawn = require('cross-spawn')
const chalk = require('chalk')

module.exports = (_, resolve, reject) => {
  const result = spawn.sync('zat', ['server', '-p', './dist'], { stdio: 'inherit' })

  resolve(`${chalk.green('log:')} ZAT server Shuts down with exit code ${result.status}`)
}
