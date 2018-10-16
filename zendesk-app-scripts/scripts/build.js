'use strict';

process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

const webpack = require('webpack');
const config = require('../config/webpack/config.prod');

module.exports = webpack(config);
