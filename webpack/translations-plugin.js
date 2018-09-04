const path = require('path')
const jsyaml = require('js-yaml')
const fs = require('fs')
const JS_INDENT = 2
const FILENAME = 'en'

const marketplaceKeys = [
  'name',
  'description',
  'short_description',
  'long_description',
  'installation_instructions',
  'parameters'
]

class TranslationsPlugin {
  constructor (options) {
    this.options = options
    enYmlToJson(options)
  }

  // Defines `apply` method in it's prototype.
  apply (compiler) {
    // Specifies webpack's event hook to attach itself.
    compiler.plugin('emit', (compilation, callback) => {
      fs.readdir(this.options.path, (err, items) => {
        if (err) throw err

        items
          .filter(filename => path.extname(filename) === '.json')
          .forEach(filename => {
            Object.assign(
              compilation.assets,
              buildMarketplaceTranslationFile(filename, this.options.path)
            )
          })

        callback()
      })
    })
  }
}

/**
 * Rebuild en.json from en.yml
 */
function enYmlToJson (options) {
  const ymlPath = path.resolve(options.path, `${FILENAME}.yml`)
  try {
    const content = fs.readFileSync(ymlPath, 'utf8')
    const translationsInput = JSON.stringify(ymltoObj(content), null, JS_INDENT)
    const newPath = path.resolve(options.path, `${FILENAME}.json`)

    fs.writeFileSync(newPath, translationsInput)
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

function ymltoObj (yaml) {
  const obj = jsyaml.safeLoad(yaml)
  const pkg = obj.parts[0].translation.key.match(/^txt.apps.([^.]+)/)[1]

  let translations = obj.parts
    .map(part => part.translation)
    .filter(
      translation => translation.obsolete
        ? (new Date(translation.obsolete) > new Date())
        : true
    )

  return arrayToNestedHash(translations).txt.apps[pkg]
}

/**
 * Transform translations array
 * [{
 *   key: 'txt.apps.example_app.app.name',
 *   value: 'Example App'
 * },
 * {
 *   key: 'txt.apps.example_app.app.short_description',
 *   value: 'Short Description'
 * }]
 *
 * into object
 *
 * {
 *   txt: {
 *     apps: {
 *       example_app: {
 *         app: {
 *           name: 'Example App',
 *           short_description: 'Short Description'
 *         }
 *       }
 *     }
 *   }
 * }
 *
 * @param {Array} arr translations array
 * @return {Object} translations object
 */
function arrayToNestedHash (arr) {
  const root = {}

  arr.forEach(
    item => {
      // split the long translation key to array of keys
      // "txt.apps.example_app.app.name" =>
      // ["txt", "apps", "example_app", "app", "name"]
      const keys = item.key.split('.')

      // create hash and traverse to the last key
      // { txt: { apps: { example_app: { app: {} } } } }
      const leafNode = keys.slice(0, -1).reduce(
        (node, key) => {
          node[key] = node[key] || {}
          return node[key]
        },
        root
      )

      // assign key:value to leaf Node
      // { txt: { apps: { example_app: { app: { key: value } } } } }
      const leafKey = keys[keys.length - 1]
      leafNode[leafKey] = item.value
    }
  )

  return root
}

function buildMarketplaceTranslationFile (filename, filepath) {
  let translationsInput
  try {
    translationsInput = JSON.parse(fs.readFileSync(path.resolve(filepath, filename)))
  } catch (err) {
    console.error(err)
    process.exit(1)
  }

  const translationsPath = `../translations/${filename}`
  const marketplaceTranslations = extractMarketplaceTranslation(translationsInput, filename)

  return {
    [translationsPath]: {
      size: () => marketplaceTranslations.length,
      source: () => marketplaceTranslations
    }
  }
}

function extractMarketplaceTranslation (translations, filename) {
  const translationsOutput = {
    _warning: `AUTOMATICALLY GENERATED FROM $/src/translations/${filename} - DO NOT MODIFY THIS FILE DIRECTLY`,
    app: {}
  }

  marketplaceKeys.forEach(
    key => {
      if (translations.app[key]) translationsOutput.app[key] = translations.app[key]
    }
  )

  return JSON.stringify(translationsOutput, null, JS_INDENT)
}

module.exports = TranslationsPlugin
