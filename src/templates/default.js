import I18n from '../lib/i18n.js'
import {escapeSpecialChars as escape} from '../lib/helpers.js'

export default function (args) {
  return `<div class="example-app">
    <div class="loader">
      <h1>${escape(args.title)}</h1>
    </div>
  </div>`
}
