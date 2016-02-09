import TicketSidebarApp from './ticket_sidebar';

var client = window.ZAFClient.init();

client.on('app.registered', function(context) {
  if (context.location === 'ticket_sidebar') {
    new TicketSidebarApp(client, context);
  }
});
