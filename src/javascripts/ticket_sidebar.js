import View from 'view';
import Storage from 'storage'

const MAX_HEIGHT = 375;

class TicketSidebar {
  constructor(client, data) {
    this.client = client;
    this._metadata = data.metadata;
    this._context = data.context;

    this.storage = new Storage(this._metadata.installationId);
    this.view = new View({ afterRender: () => {
      let newHeight = Math.min($('html').height(), MAX_HEIGHT);
      this.client.invoke('resize', { height: newHeight, width: '100%' });
    }});

    this.getCurrentUser().then(this.renderMain.bind(this));

    this.view.switchTo('loading');
  }

  getCurrentUser() {
    return this.client.request({ url: '/api/v2/users/me.json' });
  }

  renderMain(data) {
    this.view.switchTo('main', data.user);
  }
}

export default TicketSidebar;
