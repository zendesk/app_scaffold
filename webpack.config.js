const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TranslationsPlugin = require('./webpack/translations-plugin')
const devMode = process.env.NODE_ENV !== 'production'

module.exports = {
  entry: {
    app: [
      'babel-polyfill',
      './src/javascript/index.js'
    ]
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist/assets')
  },

  // list of which loaders to use for which files
  module: {
    rules: [
      {
        test: /\.js$/,
        use: { loader: 'babel-loader' }
      },
      // {
      //   test: /\.json$/,
      //   exclude: path.resolve(__dirname, './src/translations'),
      //   use: 'json-loader'
      // },
      // {
      //   test: /\.json$/,
      //   include: path.resolve(__dirname, './src/translations'),
      //   use: './webpack/translations-loader'
      // },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader'
        ]
      }
      // },
      // {
      //   test: /\.css$/,
      //   use: ['style-loader', 'css-loader', 'postcss-loader']
      // }
      // },
      // {
      //   test: /\.(gif|jpe?g|png|svg|woff2?|ttf|eot)$/,
      //   use: { loader: 'url-loader', options: { limit: 10000 } }
      // }
    ]
  },

  plugins: [
    // Empties the dist folder
    new CleanWebpackPlugin(['dist/*']),

    // Copy over some files
    new CopyWebpackPlugin([
      { from: 'src/manifest.json', to: '../', flatten: true },
      { from: 'src/images/dot.gif', to: '.', flatten: true },
      { from: 'src/images/logo.png', to: '.', flatten: true },
      { from: 'src/images/logo-small.png', to: '.', flatten: true },
      { from: 'src/templates/iframe.html', to: '.', flatten: true }
    ]),

    new MiniCssExtractPlugin({
      filename: devMode ? '[name].css' : '[name].[hash].css',
      chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
    }),

    new TranslationsPlugin({
      path: path.resolve(__dirname, './src/translations')
    })
  ]
}
