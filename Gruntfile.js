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
          filename: 'bundle.js',
          sourceMapFilename: '[file].map'
        },
        module: {
          loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            query: {
              presets: ['es2015']
            }
          }]
        },
        resolve: {
          extenstions: ['', '.js']
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
    handlebars: {
      compile: {
        files: {
          'dist/assets/templates.js': 'src/templates/**/*.hbs'
        },
        options: {
          namespace: 'Templates',
          partialsUseNamespace: true
        }
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
          './src/templates/**/*.hbs'
        ],
        tasks: ['handlebars']
      }
    }
  });

  grunt.registerTask('build', ['sass', 'handlebars', 'eslint', 'webpack']);
  grunt.registerTask('default', ['build']);
};
