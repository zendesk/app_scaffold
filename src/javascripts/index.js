/*
* This is the first JavaScript file that runs once your iframe is loaded within a Zendesk product.
*/
import ZAFClient from 'zendesk_app_framework_sdk';
import I18n from 'i18n';

// Create a new ZAFClient
var client = ZAFClient.init();

// Add an event listener to detect once your app is registered with the framework
client.on('app.registered', function(appData) {
  client.get('currentUser.locale').then(userData => {

    // Load translations based on the account's current locale
    I18n.loadTranslations(userData['currentUser.locale']);

    // Look up app module for the current location
    let location = appData.context.location;
    let App = require(`./${location}.js`).default;

    // Create a new instance of the app
    new App(client, appData);
  });
});
