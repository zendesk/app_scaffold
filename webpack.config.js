/* eslint-env node */
var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var extractStyles = new ExtractTextPlugin('main.css');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var externalAssets = {
  css: [
    'https://assets.zendesk.com/apps/sdk-assets/css/1/zendesk_garden.css'
  ],
  js: [
    'https://cdn.jsdelivr.net/g/lodash@4.14.0,handlebarsjs@4.0.5,jquery@3.1.0',
    'https://assets.zendesk.com/apps/sdk/2.0/zaf_sdk.js'
  ]
}

module.exports = {
  progress: true,
  entry: {
    app: ['./src/javascripts/index.js', './src/stylesheets/app.scss']
  },
  output: {
    path: './dist/assets',
    filename: 'main.js',
    sourceMapFilename: '[file].map'
  },
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader'
      }
    ],
    loaders: [
      {
        test: /\.(gif|jpe?g|png|svg|woff2?|ttf|eot)$/,
        loader: 'url-loader?limit=10000&name=[name].[ext]'
      },
      {
        test: /\.scss$/,
        loader: extractStyles.extract("style", ["css?sourceMap&root=" + path.resolve('./dist/assets'), "sass?sourceMap"])
      },
      {
        test: /\.json$/,
        exclude: path.resolve(__dirname, './src/translations'),
        loader: 'json-loader'
      },
      {
        test: /\.json$/,
        include: path.resolve(__dirname, './src/translations'),
        loader: 'translations-loader',
        query: {
          runtime: 'handlebars'
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      },
      {
        test: /\.(handlebars|hd?bs)$/,
        loader: 'handlebars-loader',
        query: {
          extensions: ['handlebars', 'hdbs', 'hbs'],
          runtime: 'handlebars',
          inlineRequires: '\/images\/'
        }
      }
    ]
  },
  resolveLoader: {
    modulesDirectories: ['./lib/loaders', 'node_modules']
  },
  resolve: {
    modulesDirectories: ['node_modules', './lib/javascripts'],
    alias: {
      'app_manifest': path.join(__dirname, './dist/manifest.json')
    },
    extensions: ['', '.js']
  },
  externalAssets: externalAssets,
  externals: {
    handlebars: 'Handlebars',
    jquery: 'jQuery',
    lodash: '_',
    zendesk_app_framework_sdk: 'ZAFClient'
  },
  devtool: '#eval',
  plugins: [
    extractStyles,
    new HtmlWebpackPlugin({
      warning: 'AUTOMATICALLY GENERATED FROM ./lib/templates/layout.hdbs - DO NOT MODIFY THIS FILE DIRECTLY',
      vendorCss: externalAssets.css,
      vendorJs: externalAssets.js,
      template: '!!handlebars!./lib/templates/layout.hdbs'
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        drop_debugger: false,
        warnings: false
      }
    })
  ]
};
