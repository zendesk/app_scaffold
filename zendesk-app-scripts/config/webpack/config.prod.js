/**
 * Prod environment specific webpack configs
 */

const getConfig = require('./getConfig')

module.exports = Object.assign({}, getConfig('production'), {
  devtool: 'source-map'
})
