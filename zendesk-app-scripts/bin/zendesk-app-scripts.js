#!/usr/bin/env node

'use strict';

const option = process.argv[2];

switch (option) {
  case 'start': {
    var exec = require('child_process').execSync;
    var cmd = 'zat server -p ./dist';

    exec(cmd, {stdio: 'inherit'});
    break;
  }
  case 'build': {
    let buildScriptPath = require.resolve('../scripts/' + option);
    const compiler = require(buildScriptPath);

    compiler.run((err, stats) => {
      // console.log(err, stats)
    })
    break;
  }
  default:
    console.log('Unknown script "' + option + '".');
    break;
}
