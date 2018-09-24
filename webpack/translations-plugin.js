const path = require('path')
const fs = require('fs')
const JS_INDENT = 2

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
  }

  // Defines `apply` method in it's prototype.
  apply (compiler) {
    // Specifies webpack's event hook to attach itself.
    compiler.hooks.emit.tapAsync('TranslationsPlugin', (compilation, callback) => {
      Object.assign(
        compilation.assets,
        buildMarketplaceTranslationFile('en.json', this.options.path)
      )
      callback()
    })
  }
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
