const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TranslationsPlugin = require('./webpack/translations-plugin')
const devMode = process.env.NODE_ENV !== 'production'

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

  // list of which loaders to use for which files
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

    // Copy over some files
    new CopyWebpackPlugin([
      { from: 'src/manifest.json', to: '../', flatten: true },
      { from: 'src/images/!(screenshot)*', to: '.', flatten: true },
      { from: 'src/templates/iframe.html', to: '.', flatten: true }
    ]),

    new MiniCssExtractPlugin({
      // Need something(loader?) to add the [hash] to html
      filename: devMode ? '[name].css' : '[name].[hash].css'
    }),

    new TranslationsPlugin({
      path: path.resolve(__dirname, './src/translations')
    })
  ]
}
