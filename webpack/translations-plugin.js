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

function toObj (yaml) {
  const obj = jsyaml.safeLoad(yaml)
  const pkg = obj.parts[0].translation.key.match(/^txt.apps.([^.]+)/)[1]

  let translations = obj.parts.map(function (part) { return part.translation })
  translations = translations.filter(function (translation) {
    return translation.obsolete ? (new Date(translation.obsolete) > new Date()) : true
  })

  return arrayToNestedHash(translations).txt.apps[pkg]
}

function arrayToNestedHash (arr) {
  return arr.reduce(function (result, item) {
    const keys = item.key.split('.')
    let current = result
    keys.slice(0, -1).forEach(function (key) {
      current[key] = current[key] || {}
      current = current[key]
    })
    current[keys.slice(-1)] = item.value
    return result
  }, {})
}

function extractMarketplaceTranslation (translations, jsonPath) {
  const translationsOutput = {
    _warning: `AUTOMATICALLY GENERATED FROM ${jsonPath} - DO NOT MODIFY THIS FILE DIRECTLY`,
    app: {}
  }

  marketplaceKeys.forEach(function (key) {
    if (key in translations.app) {
      translationsOutput.app[key] = translations.app[key]
    }
  })

  return JSON.stringify(translationsOutput, null, JS_INDENT)
}

function enYmlToJson (options) {
  const promise = new Promise((resolve, reject) => {
    const ymlPath = path.resolve(options.path, `${FILENAME}.yml`)

    fs.stat(ymlPath, (err, stats) => {
      if (err) reject(err)

      fs.readFile(ymlPath, 'utf8', (err, content) => {
        if (err) reject(err)

        resolve({
          name: FILENAME,
          path: ymlPath,
          content: content
        })
      })
    })
  })

  promise.then((file) => {
    return new Promise((resolve, reject) => {
      const translationsInput = JSON.stringify(toObj(file.content), null, JS_INDENT)

      const newPath = path.resolve(options.path, `../../src/translations/${file.name}.json`)

      fs.writeFile(newPath, translationsInput, (err) => {
        if (err) reject(err)
        resolve()
      })
    })
  })
}

function TranslationsPlugin (options) {
  this.options = options
  enYmlToJson(options)
}

// Defines `apply` method in it's prototype.
TranslationsPlugin.prototype.apply = function (compiler) {
  // Specifies webpack's event hook to attach itself.
  compiler.plugin('emit', (compilation, callback) => {
    fs.readdir(this.options.path, (err, items) => {
      if (err) throw err

      items
        // get all .json files
        .filter((filename) => {
          return path.extname(filename) === '.json'
        })
        .map((filename) => {
          const content = fs.readFileSync(path.resolve(this.options.path, filename))

          const translationsInput = JSON.parse(content)

          const translationsPath = `../translations/${filename}`
          const marketplaceTranslations = extractMarketplaceTranslation(translationsInput, translationsPath)
          compilation.assets[translationsPath] = {
            size: function () {
              return marketplaceTranslations.length
            },
            source: function () {
              return marketplaceTranslations
            }
          }
        })

      callback()
    })
  })
}

module.exports = TranslationsPlugin
