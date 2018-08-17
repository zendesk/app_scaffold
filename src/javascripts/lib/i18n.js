import manifest from '../../manifest.json'

const defaultLocale = manifest.defaultLocale || 'en'

let translations

function curlyFormat (str, context) {
  const regex = /{{(.*?)}}/g
  const matches = []
  let match

  do {
    match = regex.exec(str)
    if (match) {
      matches.push(match)
    }
  } while (match)

  return matches.reduce(function (str, match) {
    const newRegex = new RegExp(match[0], 'g')
    str = str.replace(newRegex, context[match[1]])
    return str
  }, str)
}

const I18n = {
  tryRequire: function (locale) {
    try {
      return require(`../../translations/${locale}.json`)
    } catch (e) {
      return null
    }
  },

  t: function (key, context) {
    if (!translations) {
      throw new Error('Translations must be initialized with I18n.loadTranslations before calling `t`.')
    }
    const keyType = typeof key
    if (keyType !== 'string') {
      throw new Error(`Translation key must be a string, got: ${keyType}`)
    }
    const template = translations[key]
    if (!template) {
      throw new Error(`Missing translation: ${key}`)
    }
    if (typeof template !== 'string') {
      throw new Error(`Invalid translation for key: ${key}`)
    }
    const html = curlyFormat(template, context)
    return html
  },

  loadTranslations: function (locale) {
    translations = I18n.tryRequire(locale) ||
      I18n.tryRequire(locale.replace(/-.+$/, '')) || // e.g. fallback `en-US` to `en`
      I18n.tryRequire(defaultLocale) ||
      {}
    return translations
  }
}

export default I18n
