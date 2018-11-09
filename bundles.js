const { getGardenLink } = require('@zendesk/zendesk-app-scripts')
const devDependencies = require('./package.json').devDependencies
const zendeskGardenJsDelivrUrl = getGardenLink(devDependencies)

const locations = [
  {
    name: 'ticket_sidebar',
    entry: [
      './src/javascripts/locations/ticket_sidebar.js',
      './src/index.css'
    ],
    vendorCss: [
      zendeskGardenJsDelivrUrl
    ],
    vendorJs: [
      'https://assets.zendesk.com/apps/sdk/2.0/zaf_sdk.js',
      'https://cdn.jsdelivr.net/npm/babel-polyfill@6.26.0/dist/polyfill.min.js'
    ],
    template: './src/templates/iframe.html',
    filename: 'ticket_sidebar.html'
  },
  {
    name: 'topbar',
    entry: [
      './src/javascripts/locations/ticket_sidebar.js'
    ],
    vendorJs: [
      'https://assets.zendesk.com/apps/sdk/2.0/zaf_sdk.js',
      'https://cdn.jsdelivr.net/npm/babel-polyfill@6.26.0/dist/polyfill.min.js'
    ],
    template: './src/templates/iframe.html',
    filename: 'topbar.html'
  }
]

module.exports = locations
