/**
 * {
 *   name: 'test app',
 *   author: {
 *     title: 'the author',
 *     value: 'mr programmer'
 *   },
 *   app: {
 *     instructions: 'install',
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
/* eslint-disable array-callback-return */
function translationFlatten (object, currentKeys = []) {
  const res = {}

  Object.keys(object).map(
    key => {
      const value = object[key]

      if (typeof value === 'object') {
        if (value.title && value.value) {
          const flattenedKey = [...currentKeys, key].join('.')
          res[flattenedKey] = value.value
        } else {
          Object.assign(
            res,
            translationFlatten(value, [...currentKeys, key])
          )
        }
      } else {
        const flattenedKey = [...currentKeys, key].join('.')
        res[flattenedKey] = value
      }
    }
  )

  return res
}
/* eslint-enable array-callback-return */

function TranslationsLoader (content) {
  let translationsInput
  try {
    translationsInput = JSON.parse(content)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }

  const compiledTranslations = translationFlatten(translationsInput)

  return `module.exports = ${JSON.stringify(compiledTranslations)}`
}

module.exports = TranslationsLoader
