#!/usr/bin/env node

'use strict'

const meow = require('meow')
const chalk = require('chalk')
const spawn = require('cross-spawn')

const cli = meow(`
    Usage
      $ zendesk-app-scripts

    Options
      build,                Run production build
      build --dev,          Run development build
      test,                 Run tests
      start,                Start local ZAT server
`)

const { input: [option], flags } = cli

switch (option) {
  case 'start': {
    const result = spawn.sync('zat', ['server', '-p', './dist'], { stdio: 'inherit' })
    process.exit(result.status)
    break
  }
  case 'build':
  case 'test': {
    const scriptPath = require.resolve('../scripts/' + option)
    const task = require(scriptPath)
    task.call(null, flags)
    break
  }
  default:
    console.log(`${chalk.yellow('warning')} Option "${chalk.bold(option)}" not found.`)
    cli.showHelp()
    break
}
