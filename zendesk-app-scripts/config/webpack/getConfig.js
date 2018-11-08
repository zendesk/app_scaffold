/**
 * Helper function to generate webpack entries, html-webpack-plugin instances based on bundles.js in the app project root
 * Consolidate config objects
 */

const HtmlWebpackPlugin = require('html-webpack-plugin')
const common = require('./common')
const bundles = require(`${process.cwd()}/bundles.js`)

module.exports = (mode) => {
  const entry = bundles.reduce((accum, bundle) => {
    accum[bundle.name] = bundle.entry
    return accum
  }, {})

  const htmlWebpackPlugins = bundles.map((bundle) => {
    return new HtmlWebpackPlugin({
      warning: 'AUTOMATICALLY GENERATED FROM ./src/iframe.html - DO NOT MODIFY THIS FILE DIRECTLY',
      vendorCss: bundle.vendorCss,
      vendorJs: bundle.vendorJs,
      template: bundle.template,
      filename: bundle.filename,
      chunks: [bundle.name]
    })
  })

  return Object.assign({}, common, {
    entry,
    mode,
    plugins: [
      ...common.plugins,
      ...htmlWebpackPlugins
    ]
  })
}
