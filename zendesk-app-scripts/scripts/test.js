'use strict'

const path = require('path')
const chalk = require('chalk')
const jest = require('jest')

module.exports = (flags, resolve, reject) => {
  delete flags.config
  delete flags.c

  const logs = []
  const options = []

  const baseConfigPath = path.resolve(__dirname, '../config/jest.config.js')
  const baseConfig = require(baseConfigPath)

  let customConfig = require(`${process.cwd()}/package.json`).jest
  if (typeof customConfig === 'object') {
    logs.push(`${chalk.green('log:')} Custom jest configurations from package.json is merged`)
  }
  else {
    customConfig = {}
  }

  const mergedConfig = Object.assign({}, baseConfig, customConfig)
  options.push(`--config`, JSON.stringify(mergedConfig))

  Object.keys(flags).forEach((key) => {
    options.push(`--${key}`)
    if(typeof flags[key] === 'string') {
      options.push(flags[key])
    }
  })

  logs.push(`${chalk.green('log:')} Test Complete`)
  resolve(jest.run(options).then(() => logs.join('\n')))
}
