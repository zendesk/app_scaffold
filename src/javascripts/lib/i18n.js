import manifest from '../../manifest.json'

const defaultLocale = manifest.defaultLocale || 'en'

// map to store the key/translation pairs of the loaded language
let translations

/**
 * Replace placeholders in the given string with context
 * @param {String} str string with placeholders to be replaced
 * @param {Object} context object contains placeholder/value pairs
 * @return {String} formatted string
 */
function parsePlaceholders (str, context) {
  const regex = /{{(.*?)}}/g
  const matches = []
  let match

  do {
    match = regex.exec(str)
    if (match) matches.push(match)
  } while (match)

  return matches.reduce(
    (str, match) => {
      const newRegex = new RegExp(match[0], 'g')
      str = str.replace(newRegex, context[match[1]])

      return str
    },
    str
  )
}

const I18n = {
  tryRequire: function (locale) {
    try {
      return require(`../../translations/${locale}.json`)
    } catch (e) {
      return null
    }
  },

  /**
   * Translate key with currently loaded translations,
   * optional context to replace the placeholders in the translation
   * @param {String} key
   * @param {Object} context object contains placeholder/value pairs
   * @return {String} tranlated string
   */
  t: function (key, context) {
    if (!translations) throw new Error('Translations must be initialized with I18n.loadTranslations before calling `t`.')

    const keyType = typeof key
    if (keyType !== 'string') throw new Error(`Translation key must be a string, got: ${keyType}`)

    const template = translations[key]
    if (!template) throw new Error(`Missing translation: ${key}`)
    if (typeof template !== 'string') throw new Error(`Invalid translation for key: ${key}`)

    return parsePlaceholders(template, context)
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
