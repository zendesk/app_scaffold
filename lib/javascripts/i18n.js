import Handlebars from 'handlebars';
import manifest from 'app_manifest';

const defaultLocale = manifest.defaultLocale || 'en';

let translations;

function tryRequire(locale) {
  try {
    return require(`../../src/translations/${locale}.json`);
  } catch(e) {
    return null;
  }
}

const I18n = Object.freeze({
  t: function(key, context) {
    if (!translations) {
      throw new Error('Translations must be initialized with I18n.loadTranslations before calling `t`.');
    }
    var keyType = typeof key;
    if (keyType !== 'string') {
      throw new Error(`Translation key must be a string, got: ${keyType}`);
    }
    var template = translations[key] || translations[`${key}.value`];
    if (!template) {
      throw new Error(`Missing translation: ${key}`);
    }
    if (!$.isFunction(template)) {
      if (typeof template !== 'string') {
        throw new Error(`Invalid translation for key: ${key}`);
      }
      template = Handlebars.compile(template);
      translations[key] = template;
    }
    var html = template(context);
    return html;
  },
  loadTranslations: function(locale) {
    translations = tryRequire(locale) ||
      tryRequire(locale.replace(/-.+$/,'')) || // e.g. fallback `en-US` to `en`
      tryRequire(defaultLocale) ||
      {};
  }
});

Handlebars.registerHelper('t', function(key, context) {
  try {
    return I18n.t(key, context.hash);
  } catch(e) {
    console.error(e);
    return e.message;
  }
});

module.exports = I18n;
