import { templatingLoop as loop, escapeSpecialChars as escape } from '../javascripts/lib/helpers.js'
import I18n from '../javascripts/lib/i18n.js'

function organizationMarkup (organization) {
  return `<li>${escape(organization.name)}</li>`
}

export default function (args) {
  return `<div class="example-app">
    <div>
      <h1>Hi ${escape(args.currentUserName)}, this is a sample app</h1>
      <h2>${I18n.t('default.organizations')}:</h2>
      <ul>${loop(args.organizations, organizationMarkup)}</ul>
    </div>
  </div>`
}
