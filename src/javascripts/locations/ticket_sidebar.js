// need to import basic garden css styles
import '@zendeskgarden/css-bedrock'

import App from '../modules/app'

/* global ZAFClient */
const client = ZAFClient.init()

client.on('app.registered', function (appData) {
  return new App(client, appData)
})
