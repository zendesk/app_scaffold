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
      const newHeight = Math.min($('html').height(), MAX_HEIGHT);
      this.client.invoke('resize', { height: newHeight, width: '100%' });
    }});

    this.client.on('ticket.collaborators.changed', this.loadCollaborators.bind(this));
    this.view.switchTo('loading');

    this.loadCollaborators();
  }

  loadCollaborators() {
    this.client.get('ticket.collaborators').then(this.renderMain.bind(this));
  }

  loadCurrentUser() {
    if (this.currentUser) {
      return Promise.resolve(this.currentUser);
    } else {
      return this.client.request('/api/v2/users/me.json').then((data) => {
        this.currentUser = data.user;
        return this.currentUser;
      });
    }
  }

  renderMain(data) {
    this.loadCurrentUser().then((currentUser) => {
      console.log(currentUser);
      const collaborators = data['ticket.collaborators'];
      this.view.switchTo('main', {
        ticketId: this._context.ticketId,
        collaborators,
        currentUser: currentUser
      });

      $('#add-cc').on('click', (e) => {
        e.preventDefault();
        const email = $('#email-address').val();
        this.client.invoke('ticket.collaborators.add', { email });
      });
    })
  }
}

export default TicketSidebar;
