var loaderUtils = require('loader-utils');

function TranslationsLoader(content) {
  this.cacheable && this.cacheable();
  var query = loaderUtils.parseQuery(this.query);
  var translationsInput = JSON.parse(content);
  var permittedKeys = ["name", "description", "instructions", "parameters"];
  var translationsOutput = {
    _warning: "AUTOMATICALLY GENERATED - DO NOT MODIFY THIS FILE DIRECTLY",
    app: {}
  };
  permittedKeys.forEach(function(key) {
    if (key in translationsInput.app) {
      translationsOutput.app[key] = translationsInput.app[key];
    }
  });
  var name = query.name || '../translations/[name].json';
  var translationsContent = JSON.stringify(translationsOutput, 2, 4);
  var url = loaderUtils.interpolateName(this, name, { content: translationsContent });
  this.emitFile(url, translationsContent);
  return content;
}

module.exports = TranslationsLoader;
