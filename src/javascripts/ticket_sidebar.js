import Franc from 'franc';
import View from 'view';
import Storage from 'storage';

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

    this.getLanguages();

    this.view.switchTo('loading');
  }

  getCurrentUser() {
    return this.client.request({ url: '/api/v2/users/me.json' });
  }

  getLanguages() {
    this.getTicketDescriptionLanguage().then(
      language => this.setTicketLanguage(language)
    );
    this.getTicketRequesterLocale().then(
      locale => {
        this.setRequesterLocale(locale);
        this.parseLanguages();
      }
    );
  }

  getTicketRequesterLocale() {
    return this.client.get('ticket.requester').then(requester => {
      const locale = requester['ticket.requester'].locale;
      return locale;
    });
  }

  getTicketDescriptionLanguage() {
    return this.client.get('ticket.description').then(description => {
      const language = Franc(description['ticket.description']);
      return language;
    })
  }

  setRequesterLocale(locale) {
    this.requesterLocale = locale;
  }

  setTicketLanguage(language) {
    this.ticketLanguage = language;
  }

  parseLanguages() {
    var languages = {
      "ticket-language": this.ticketLanguage,
      "requester-locale": this.requesterLocale
    }
    this.renderMain(languages);
  }

  renderMain(data) {
    this.view.switchTo('main', data);
  }
}

export default TicketSidebar;
