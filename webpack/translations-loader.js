const flatten = require('lodash/flatten')

/**
 * {
 *   name: 'test app'
 *   author: {
 *     title: 'the author',
 *     value: 'mr programmer'
 *   },
 *   app: {
 *     instructions: 'install'
 *     steps: {
 *       click: 'this button'
 *     }
 *   }
 * }
 *
 * becomes
 *
 * {
 *   name: 'test app',
 *   author: 'mr programmer',
 *   app.instructions: 'install',
 *   app.steps.click: 'this button'
 * }
 */
function translationFlatten (object, flattened = {}, currentKeys = []) {
  Object.keys(object).map(function (key) {
    const value = object[key]
    if (typeof value === 'object') {
      if (value.title && value.value) {
        flattened[flatten([currentKeys, key]).join('.')] = value.value
      } else {
        translationFlatten(value, flattened, flatten([currentKeys, key]))
      }
    } else {
      flattened[flatten([currentKeys, key]).join('.')] = value
    }
  })
  return flattened
}

// It compiles the Handlebars templates for the translation file to be used within the app's i18n shim
function TranslationsLoader (content) {
  this.cacheable && this.cacheable()
  const translationsInput = JSON.parse(content)
  const compiledTranslations = translationFlatten(translationsInput)
  return `module.exports = ${JSON.stringify(compiledTranslations)}`
}

module.exports = TranslationsLoader
