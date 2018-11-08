#!/usr/bin/env node

'use strict'

const meow = require('meow')
const chalk = require('chalk')

// Unhandled promise rejections will fallback to here
process.on('unhandledRejection', e => {
  console.error(e)
  process.exit(1)
});

const cli = meow(`
    Usage
      $ zendesk-app-scripts

    Options
      start,                      Start local ZAT server
      test [--watch|--watchAll],  Run tests
      build [--dev],              Run build in production/development mode
`)

const { input: [option], flags } = cli

switch (option) {
  case 'start':
  case 'build':
  case 'test': {
    const scriptPath = require.resolve('../scripts/' + option)
    const task = require(scriptPath)
    // Task scripts are called as Promise executor
    // Resolved with logs
    // Rejections with error will be handled in unhandledRejection event handler
    new Promise(task.bind(null, flags)).then((logs) => {
      console.log(logs)
    })
    break
  }
  default:
    // Options not supported yet
    console.log(`${chalk.yellow('warning:')} Option "${chalk.bold(option)}" not found.`)
    cli.showHelp()
    break
}
