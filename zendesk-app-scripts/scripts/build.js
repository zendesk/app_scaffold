'use strict'
const chalk = require('chalk')
const webpack = require('webpack')

module.exports = ({dev, config}) => {
  const env = dev ? 'dev' : 'prod'

  try {
    const configObject = require(config || `../config/webpack/config.${env}`)
    if (config) console.log(chalk.green(`log: ${config} is used instead of default webpack config`))

    webpack(configObject, (err, stats) => {
      if (err) {
        console.error(err.stack || err);
        if (err.details) {
          console.error(err.details);
        }
        process.exit(1)
      }

      const info = stats.toJson();

      if (stats.hasErrors()) {
        console.error(`${chalk.red('error:')} ${info.errors.join('\n')}`)
        process.exit(1)
      }

      if (stats.hasWarnings()) {
        console.error(`${chalk.yellow('error:')} ${info.warnings.join('\n')}`)
        process.exit(1)
      }
    })
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}
