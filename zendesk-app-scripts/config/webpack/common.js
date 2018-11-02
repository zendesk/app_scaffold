const path = require('path')
const chalk = require('chalk')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TranslationsPlugin = require('./translations-plugin')

let customBabelOptions = require(`${process.cwd()}/package.json`).babel
let postCssOptions = require(`${process.cwd()}/package.json`).postcss

if (typeof customBabelOptions === 'object') {
  console.log(`${chalk.green('log:')} Custom babel configurations from package.json is merged`)
}
else {
  customBabelOptions = {}
}

const mergedBabelOptions = Object.assign(
  {"presets": ["@babel/preset-env"]},
  customBabelOptions
)

if (typeof postCssOptions === 'object') {
  console.log(`${chalk.green('log:')} Custom PostCss configurations from package.json is used instead of default`)
  postCssOptions = {}
}
else {
  postCssOptions = {
    ident: 'postcss',
    plugins: () => [
      require('postcss-preset-env')(),
      require('postcss-import')(),
      require('precss')()
    ]
  }
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
          options: mergedBabelOptions
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
