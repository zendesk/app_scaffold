'use strict'

const path = require('path')
const spawn = require('cross-spawn')
const chalk = require('chalk')

module.exports = (flags) => {
  delete flags.config
  delete flags.c

  const options = ['jest']

  const baseConfigPath = path.resolve(__dirname, '../config/jest.config.js')
  const baseConfig = require(baseConfigPath)

  const customConfig = require(`${process.cwd()}/package.json`).jest || {}

  const configObject = Object.assign({}, baseConfig, customConfig)
  options.push(`--config=${JSON.stringify(configObject)}`)

  if (Object.keys(customConfig).length)
  console.log(chalk.green(`log: custom jest configurations from package.json is merged`))

  Object.keys(flags).forEach((key) => {
    options.push(`--${key}=${flags[key]}`)
  })

  const result = spawn.sync('yarn', options, { stdio: 'inherit' })

  process.exit(result.status)
}
