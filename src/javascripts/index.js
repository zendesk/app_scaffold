import TicketSidebarApp from './ticket_sidebar';
import ZAFClient from 'zendesk_app_framework_sdk';

var client = ZAFClient.init();

client.on('app.registered', function(context) {
  if (context.location === 'ticket_sidebar') {
    new TicketSidebarApp(client, context);
  }
});
