import manifest from 'app_manifest';
const defaultLocale = manifest.defaultLocale || 'en';

function tryRequire(locale) {
  try {
    return require(`../../src/translations/${locale}.json`);
  } catch(e) {
    return null;
  }
}

module.exports = Object.freeze({
  t: function(app, key, context) {
    var keyType = typeof key;
    if (keyType !== 'string') {
      throw new Error(`Translation key must be a string, got: ${keyType}`);
    }
    var template = _.at(app.translations, key)[0];
    if (!template) {
      throw new Error(`Missing translation: ${key}`);
    }
    if (!$.isFunction(template)) {
      if (typeof template !== 'string') {
        throw new Error(`Invalid translation for key: ${key}`);
      }
      template = Handlebars.compile(template);
      _.set(app.translations, key, template);
    }
    var html = template(context);
    return html;
  },
  loadTranslations: function(app, locale) {
    app.translations = tryRequire(locale) ||
      tryRequire(locale.replace(/-.+$/,'')) || // e.g. fallback `en-US` to `en`
      tryRequire(defaultLocale) ||
      {};
  }
});
