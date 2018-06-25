import I18n from '../lib/i18n.js'
import {escapeSpecialChars as escape} from '../lib/helpers.js'

export default function (args) {
  return `<div>${escape(args.title)}</div>`
}
