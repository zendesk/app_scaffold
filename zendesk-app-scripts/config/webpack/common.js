const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TranslationsPlugin = require('./translations-plugin')

module.exports = {
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM',
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
          options: {
            presets: ['env']
          }
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
      { root: process.cwd() }
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
