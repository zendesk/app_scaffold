#!/usr/bin/env node

'use strict'

const meow = require('meow')
const chalk = require('chalk')

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
    new Promise(task.bind(null, flags)).then((msg) => {
      console.log(msg)
    })
    break
  }
  default:
    console.log(`${chalk.yellow('warning:')} Option "${chalk.bold(option)}" not found.`)
    cli.showHelp()
    break
}
