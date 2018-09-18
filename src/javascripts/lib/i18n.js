import manifest from '../../manifest.json'

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

  return matches.reduce((str, match) => {
    const newRegex = new RegExp(match[0], 'g')
    str = str.replace(newRegex, context[match[1]])
    return str
  }, str)
}

class I18n {
  constructor (locale = 'en') {
    this.loadTranslations(locale)
  }

  tryRequire (locale) {
    try {
      return require(`../../translations/${locale}.json`)
    } catch (e) {
      return null
    }
  }

  /**
   * Translate key with currently loaded translations,
   * optional context to replace the placeholders in the translation
   * @param {String} key
   * @param {Object} context object contains placeholder/value pairs
   * @return {String} tranlated string
   */
  t (key, context) {
    if (!translations) throw new Error('Translations must be initialized with i18n.loadTranslations before calling `t`.')

    const keyType = typeof key
    if (keyType !== 'string') throw new Error(`Translation key must be a string, got: ${keyType}`)

    const template = translations[key]
    if (!template) throw new Error(`Missing translation: ${key}`)
    if (typeof template !== 'string') throw new Error(`Invalid translation for key: ${key}`)

    return parsePlaceholders(template, context)
  }

  loadTranslations (locale) {
    const newTranslations = this.tryRequire(locale) || this.tryRequire(locale.replace(/-.+$/, ''))
    if (newTranslations) translations = newTranslations
  }
}

export default new I18n(manifest.defaultLocale)
