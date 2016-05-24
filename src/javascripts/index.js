import LegacyApp from './legacy_app';
import ZAFClient from 'zendesk_app_framework_sdk';

var client = ZAFClient.init();

client.on('app.registered', function(data) {
  new LegacyApp(client, data);
});
