import BaseApp from './base_app'

class TicketSidebarApp extends BaseApp {
  constructor() {
    this.render('main', { user: 'world' });
  }
}

export default TicketSidebarApp;
