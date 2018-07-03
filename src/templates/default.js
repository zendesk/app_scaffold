import {templatingLoop as loop, escapeSpecialChars as escape} from '../javascript/lib/helpers.js'

function organizationMarkup (organization) {
  return `<li>${escape(organization.name)}</li>`
}

export default function (args) {
  return `<div class="example-app">
    <div>
      <h1>Hi ${escape(args.currentUserName)}, this is a sample app</h1>
      <ul>${loop(args.organizations, organizationMarkup)}</ul>
    </div>
  </div>`
}
