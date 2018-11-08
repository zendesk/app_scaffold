/**
 * Exectutor for "zendesk-app-scripts build" command
 * If build task succeed, resolve with logs
 * If build task failed, reject with errors
 */

'use strict'
const path = require('path')
const chalk = require('chalk')
const webpack = require('webpack')

module.exports = ({dev, config}, resolve, reject) => {
  const logs = []
  const env = dev ? 'dev' : 'prod'

  // If custom webpack config file is provided, use it instead of default config file
  const configObject = require((config && path.resolve(process.cwd(), config)) || `../config/webpack/config.${env}`)
  if (config) {
    logs.push(`${chalk.green('log:')} ${config} is used instead of default webpack config`)
  }

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
