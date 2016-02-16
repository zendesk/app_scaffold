/* eslint-env node */
'use strict';

var webpack = require('webpack');

module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    eslint: {
      target: ['./src/javascripts/**/*.js']
    },
    sass: {
      options: {
        sourceMap: true
      },
      dist: {
        files: {
          './dist/assets/main.css': './src/stylesheets/**/*.scss'
        }
      }
    },
    webpack: {
      build: {
        progress: true,
        entry: {
          app: './src/javascripts/index.js'
        },
        output: {
          path: './dist/assets',
          filename: 'main.js',
          sourceMapFilename: '[file].map'
        },
        module: {
          loaders: [
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
                runtime: 'handlebars'
              }
            }
          ]
        },
        resolve: {
          extensions: ['', '.js']
        },
        externals: {
          handlebars: 'Handlebars',
          jquery: 'jQuery',
          lodash: '_',
          moment: 'moment'
        },
        devtool: '#source-map',
        plugins: [
          new webpack.optimize.UglifyJsPlugin({
            compress: {
              warnings: false
            }
          })
        ]
      }
    },
    watch: {
      css: {
        files: [
          './src/stylesheets/**/*.scss'
        ],
        tasks: ['sass']
      },
      js: {
        files: [
          './src/javascripts/**/*.js'
        ],
        tasks: ['eslint', 'webpack']
      },
      hbs: {
        files: [
          './src/templates/**/*.hbs',
          './src/templates/**/*.hdbs',
          './src/templates/**/*.handlebars'
        ],
        tasks: ['webpack']
      }
    }
  });

  grunt.registerTask('build', ['sass', 'eslint', 'webpack']);
  grunt.registerTask('default', ['build']);
};
