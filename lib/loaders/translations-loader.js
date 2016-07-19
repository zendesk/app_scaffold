var loaderUtils = require('loader-utils');
var handlebars = require('handlebars');
var path = require('path');
var hb = handlebars.create();
const JS_INDENT = 2;

function flatten(object) {
  var flattened = {};
  Object.keys(object).forEach(function(key) {
    if (object[key] && typeof object[key] === 'object') {
      var flatObject = flatten(object[key]);
      Object.keys(flatObject).forEach(function(key2) {
        flattened[[key, key2].join('.')] = flatObject[key2];
      });
    } else {
      flattened[key] = object[key];
    }
  });
  return flattened;
}

function compileTranslations(translations) {
  var flattenedTranslations = flatten(translations);
  var rows = Object.keys(flattenedTranslations).map(function(translationKey) {
    var template = hb.precompile(flattenedTranslations[translationKey]);
    return `${JSON.stringify(translationKey)}: (Handlebars["default"] || Handlebars).template(${template})`;
  });
  return `{ ${rows.join(',\n')} }`;
}

function extractMarketplaceTranslation(translations, jsonPath) {
  var permittedKeys = ["name", "description", "instructions", "parameters"];
  var translationsOutput = {
    _warning: `AUTOMATICALLY GENERATED FROM ${jsonPath} - DO NOT MODIFY THIS FILE DIRECTLY`,
    app: {}
  };
  permittedKeys.forEach(function(key) {
    if (key in translations.app) {
      translationsOutput.app[key] = translations.app[key];
    }
  });
  return JSON.stringify(translationsOutput, null, JS_INDENT);
}

// This loader performs two tasks:
// 1. It extracts the app name, description, instructions and parameters keys
//    and saves them to the dist/translations/[locale].json files
// 2. It compiles the Handlebars templates for the translation file to be used
//    within the app's i18n shim
function TranslationsLoader(content) {
  this.cacheable && this.cacheable();
  var query = loaderUtils.parseQuery(this.query);
  var name = query.name || '../translations/[name].json';
  var runtimePath = query.runtime || require.resolve("handlebars/runtime");

  var translationsInput = JSON.parse(content);
  var translationsPath = path.relative(this.options.context, this.resourcePath);
  var marketplaceTranslations = extractMarketplaceTranslation(translationsInput, translationsPath);
  var url = loaderUtils.interpolateName(this, name, { content: marketplaceTranslations });
  this.emitFile(url, marketplaceTranslations);

  var compiledTranslations = compileTranslations(translationsInput);
  return `
    var Handlebars = require(${JSON.stringify(runtimePath)});
    module.exports = ${compiledTranslations};
  `;
}

module.exports = TranslationsLoader;
