'use strict'
const chalk = require('chalk')
const webpack = require('webpack')

module.exports = ({dev, config}, resolve, reject) => {
  const logs = []
  const env = dev ? 'dev' : 'prod'

  const configObject = require(config || `../config/webpack/config.${env}`)
  if (config) logs.push(`${chalk.green('log:')} ${config} is used instead of default webpack config`)

  webpack(configObject, (err, stats) => {
    if (err) {
      reject(new Error(err.stack || err || err.details))
    }

    const info = stats.toJson();

    if (stats.hasErrors()) {
      reject(new Error(info.errors.join('\n')))
    }

    if (stats.hasWarnings()) {
      logs.push(chalk.yellow('warning: ') + info.warnings.join('\n'))
    }

    logs.push(`${chalk.green('log:')} Build Complete`)
    resolve(logs.join('\n'))
  })
}
