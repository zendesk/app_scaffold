/**
 * Default shared configs across environments
 */

const path = require('path')
const chalk = require('chalk')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TranslationsPlugin = require('./translations-plugin')

// Get custom babel options from package.json in the app project
// If exists, merge with default babel options
let customBabelOptions = require(`${process.cwd()}/package.json`).babel
let babelOptions = { "presets": ["@babel/preset-env"] }
if (typeof customBabelOptions === 'object') {
  console.log(`${chalk.green('log:')} Custom babel configurations from package.json is merged`)
  Object.assign(babelOptions, customBabelOptions)
}

// Check if custom PostCss options are available in package.json in the app project
// If exists, we need to reset default options to {}, so postcss-loader will load the custom options automatically
let customPostCssOptions = require(`${process.cwd()}/package.json`).postcss
let postCssOptions = {
  ident: 'postcss',
  plugins: () => [
    require('postcss-preset-env')(),
    require('postcss-import')(),
    require('precss')()
  ]
}
if (typeof customPostCssOptions === 'object') {
  console.log(`${chalk.green('log:')} Custom PostCss configurations from package.json is used instead of default`)
  postCssOptions = {}
}

module.exports = {
  externals: {
    'ZAFClient': 'ZAFClient'
  },
  output: {
    filename: '[name].js',
    path: `${process.cwd()}/dist/assets`,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: babelOptions
        }
      },
      {
        type: 'javascript/auto',
        test: /\.json$/,
        include: `${process.cwd()}/src/translations`,
        use: path.resolve(__dirname, './translations-loader')
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {loader: 'css-loader', options: { url: false }},
          {
            loader: 'postcss-loader',
            options: postCssOptions
          }
        ]
      },
      {
        test: /\.svg$/,
        use: { loader: 'raw-loader' }
      }
    ]
  },

  plugins: [
    new CleanWebpackPlugin(
      [`${process.cwd()}/dist/*`],
      { root: process.cwd(), verbose: false }
    ),

    new CopyWebpackPlugin([
      { from: 'src/manifest.json', to: '../', flatten: true },
      { from: 'src/images/*', to: '.', flatten: true }
    ]),

    new MiniCssExtractPlugin({
      filename: '[name].css'
    }),

    new TranslationsPlugin({
      path: `${process.cwd()}/src/translations`
    })
  ]
}
