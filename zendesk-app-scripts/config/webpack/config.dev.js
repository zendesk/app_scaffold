/**
 * Dev environment specific webpack configs
 */

const getConfig = require('./getConfig')

module.exports = Object.assign({}, getConfig('development'), {
  devtool: 'inline-source-map'
})
