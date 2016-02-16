/* eslint-env node */
'use strict';

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
          filename: 'bundle.js'
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
        }
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
    uglify: {
      options: {
        sourceMap: true,
        sourceMapName: './dist/assets/bundle.map'
      },
      build: {
        files: {
          './dist/assets/bundle.min.js': './dist/assets/bundle.js'
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
        tasks: ['eslint', 'webpack', 'uglify']
      },
      hbs: {
        files: [
          './src/templates/**/*.hbs'
        ],
        tasks: ['handlebars']
      }
    }
  });

  grunt.registerTask('build', ['sass', 'handlebars', 'eslint', 'webpack', 'uglify']);
  grunt.registerTask('default', ['build']);
};
