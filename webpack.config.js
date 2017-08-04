/* eslint-env node */
var path = require("path");
var webpack = require("webpack");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var extractStyles = new ExtractTextPlugin("main.css");
var HtmlWebpackPlugin = require("html-webpack-plugin");

var externalAssets = {
  css: ["https://cdn.jsdelivr.net/bootstrap/2.3.2/css/bootstrap.min.css"],
  js: [
    "https://cdn.jsdelivr.net/g/lodash@2.4.2(lodash.underscore.min.js),handlebarsjs@1.3.0,jquery@2.2.4,momentjs@2.9.0,bootstrap@2.3.2",
    "https://assets.zendesk.com/apps/sdk/2.0/zaf_sdk.js"
  ]
};

module.exports = {
  entry: {
    app: [
      "babel-polyfill",
      "./src/javascripts/index.js",
      "./src/stylesheets/app.scss"
    ]
  },
  output: {
    path: path.resolve(__dirname, "./dist/assets"),
    filename: "main.js",
    sourceMapFilename: "[file].map"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        enforce: "pre",
        loader: "eslint-loader"
      },
      {
        test: /\.(gif|jpe?g|png|svg|woff2?|ttf|eot)$/,
        loader: "url-loader?limit=10000&name=[name].[ext]"
      },
      {
        test: /\.scss$/,
        use: extractStyles.extract({
          fallback: "style-loader",
          use: [
            "css-loader?sourceMap&root=" +
              path.resolve(__dirname, "./dist/assets"),
            "sass-loader?sourceMap"
          ]
        })
      },
      {
        test: /\.json$/,
        include: path.resolve(__dirname, "./src/translations"),
        loader: "translations-loader",
        options: {
          runtime: "handlebars"
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.(handlebars|hd?bs)$/,
        loader: "handlebars-loader",
        options: {
          extensions: ["handlebars", "hdbs", "hbs"],
          inlineRequires: "/images/"
        }
      }
    ]
  },
  resolveLoader: {
    modules: ["node_modules", path.resolve(__dirname, "./lib/loaders")]
  },
  resolve: {
    modules: ["node_modules", path.resolve(__dirname, "./lib/javascripts")],
    alias: {
      app_manifest: path.resolve(__dirname, "./dist/manifest.json")
    }
  },
  externals: {
    handlebars: "Handlebars",
    jquery: "jQuery",
    lodash: "_",
    moment: "moment",
    zendesk_app_framework_sdk: "ZAFClient"
  },
  devtool: "#eval",
  plugins: [
    extractStyles,
    new HtmlWebpackPlugin({
      warning:
        "AUTOMATICALLY GENERATED FROM ./lib/templates/layout.hdbs - DO NOT MODIFY THIS FILE DIRECTLY",
      vendorCss: externalAssets.css,
      vendorJs: externalAssets.js,
      template: "!!handlebars-loader!./lib/templates/layout.hdbs"
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        drop_debugger: false,
        warnings: false
      }
    })
  ]
};
