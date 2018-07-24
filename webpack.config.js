const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TranslationsPlugin = require('./webpack/translations-plugin')

module.exports = {
  entry: {
    app: [
      'babel-polyfill',
      './src/javascript/index.js',
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
      { from: 'src/images/!(screenshot)*', to: '.', flatten: true },
      { from: 'src/templates/iframe.html', to: '.', flatten: true }
    ]),

    new MiniCssExtractPlugin({
      filename: '[name].css'
    }),

    new TranslationsPlugin({
      path: path.resolve(__dirname, './src/translations')
    })
  ]
}
