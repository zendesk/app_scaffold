import BaseApp from './base_app';

class TicketSidebarApp extends BaseApp {
  constructor() {
    super();

    this.switchTo('main', { user: 'world' });
  }
}

export default TicketSidebarApp;
