'use strict';

module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    eslint: {
      target: ['./src/**/*.js']
    },
    webpack: {
      build: {
        progress: true,
        entry: {
          app: './src/index.js'
        },
        output: {
          path: './app/assets',
          filename: 'bundle.js'
        },
        module: {
          loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
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
          'app/assets/templates.js': 'src/templates/**/*.hbs'
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
        sourceMapName: './app/assets/bundle.map'
      },
      build: {
        files: {
          './app/assets/bundle.min.js': './app/assets/bundle.js'
        }
      }
    },
    watch: {
      js: {
        files: [
          './src/**/*.js',
        ],
        tasks: ['eslint', 'webpack', 'uglify']
      },
      hbs: {
        files: [
          './src/templates/**/*.hbs',
        ],
        tasks: ['handlebars']
      }
    }
  });

  grunt.registerTask('default', ['watch']);
};
