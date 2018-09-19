const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TranslationsPlugin = require('./webpack/translations-plugin')
const devDependencies = require('./package.json').devDependencies

// this function reads Zendesk Garden npm dependencies from package.json and
// creates a jsDelivr url
const zendeskGardenJsDelivrUrl = (function () {
  const pkg = Object.keys(devDependencies).filter(item => item.includes('@zendeskgarden/css'))

  return pkg.reduce(
    (url, pkg) => {
      const version = devDependencies[pkg]
        .replace(/^[\^~]/g, '')
        .replace(/\.\d$/, '')
      url = `${url}npm/${pkg}@${version},`
      return url
    },
    'https://cdn.jsdelivr.net/combine/'
  ).slice(0, -1)
}())

const externalAssets = {
  css: [
    zendeskGardenJsDelivrUrl
  ],
  js: [
    'https://assets.zendesk.com/apps/sdk/2.0/zaf_sdk.js'
  ]
}

module.exports = {
  entry: {
    app: [
      'babel-polyfill',
      './src/javascripts/locations/ticket_sidebar.js',
      './src/index.css'
    ]
  },
  mode: process.env.NODE_ENV,
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist/assets')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: { loader: 'babel-loader' }
      },
      {
        type: 'javascript/auto',
        test: /\.json$/,
        include: path.resolve(__dirname, './src/translations'),
        use: './webpack/translations-loader'
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {loader: 'css-loader', options: { url: false }},
          'postcss-loader'
        ]
      }
    ]
  },

  plugins: [
    // Empties the dist folder
    new CleanWebpackPlugin(['dist/*']),

    // Copy over static assets
    new CopyWebpackPlugin([
      { from: 'src/manifest.json', to: '../', flatten: true },
      { from: 'src/images/*', to: '.', flatten: true }
    ]),

    new MiniCssExtractPlugin({
      filename: '[name].css'
    }),

    new TranslationsPlugin({
      path: path.resolve(__dirname, './src/translations')
    }),

    new HtmlWebpackPlugin({
      warning: 'AUTOMATICALLY GENERATED FROM ./src/templates/iframe.html - DO NOT MODIFY THIS FILE DIRECTLY',
      vendorCss: externalAssets.css,
      vendorJs: externalAssets.js,
      template: './src/templates/iframe.html',
      filename: 'iframe.html'
    })
  ]
}
