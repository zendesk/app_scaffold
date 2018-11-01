const path = require('path')
const chalk = require('chalk')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TranslationsPlugin = require('./translations-plugin')

const customBabelOptions = require(`${process.cwd()}/package.json`).babel || {}
babelOptions = Object.assign(
  {
    "presets": [
      "@babel/preset-env"
    ]
  },
  customBabelOptions
)
if (Object.keys(customBabelOptions).length)
  console.log(chalk.green(`log: custom babel configurations from package.json is merged`))

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
            options: {
              ident: 'postcss',
              plugins: () => [
                require('postcss-preset-env')(),
                require('postcss-import')(),
                require('precss')()
              ]
            }
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
