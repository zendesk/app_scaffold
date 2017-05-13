import View from 'view';
import Storage from 'storage';
import I18n from 'i18n';

const maxHeight = 375;

class TicketSidebar {
  constructor(client, data) {
    this.client = client;
    this._metadata = data.metadata;
    this._context = data.context;
    this.storage = new Storage(this._metadata.installationId);

    // Get user function
    const getUser = this.getCurrentUser();

    // Resize function
    const resizeApp = (appHeight, appWidth) => client.invoke('resize', { height: appHeight, width: appWidth });

    // Translate function
    const translate = keyword => I18n.t(keyword);

    // Translate message
    const translatedMessage = translate('message');

    this.view = new View({ afterRender: () => {

      // Cache jQuery lookup
      const $message = $('.message');

      // Add translation to DOM
      $message.text(translatedMessage);

      // Calculate new height
      let newHeight = Math.min($('html').height(), maxHeight);

      // Resize app
      resizeApp(newHeight, '100%');
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
