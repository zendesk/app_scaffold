class MigrationHelper {
  constructor(client, app) {
    this.client = client;
    this.app = app;
    this.app.sdk = client;

    // Shim some legacy framework APIs
    this.app.ajax = this.ajax.bind(this);
    this.app.setting = this.setting.bind(this);
    this.app.store = this.store.bind(this);
    this.app.renderTemplate = this.renderTemplate.bind(this);
    this.app.id = () => { return this.metadata.appId; };
    this.app.installationId = () => { return this.metadata.installationId; };
    this.app.currentUser = () => {
      return {
        id: () => { return this.context.authenticatedUserId },
        name: () => { return new Promise((resolve) => {
          resolve('agent smith')
        }) }
      }
    };
    this.app.ticket = () => { return { id: () => { return this.context.ticketId; } } };

    this.bindEvents();

    this.client.metadata().then((metadata) => {
      this.metadata = metadata;
      return this.client.context();
    }).then((context) => {
      this.context = context;
      console.log('activating app');
      this.client.trigger('app.created');
      this.client.trigger('app.activated');
    });
  }

  bindEvents() {
    for (var key in this.app.events) {
      var handler = this.app.events[key];
      if (!_.isFunction(handler)) {
        handler = this.app[handler];
      }
      this.client.on(key, handler.bind(this.app));
    }
  }

  ajax(name, ...args) {
    var requestDefinition = this.app.requests[name];
    if (_.isFunction(requestDefinition)) {
      requestDefinition = requestDefinition.apply(this.app, args);
    }
    console.log('requestDefinition', requestDefinition);
    return this.client.request(requestDefinition).then( (...response) => {
      this.client.trigger(`${name}.done`, ...response);
      this.client.trigger(`${name}.always`, ...response);
    }, (...response) => {
      this.client.trigger(`${name}.fail`, ...response);
      this.client.trigger(`${name}.always`, ...response);
    });
  }

  currentUser() {
    console.warn('currentUser() called - it will now return a promise');
    return new Promise(function(resolve) {
      resolve({ name: 'Agent Test' });
    });
  }

  renderTemplate(name, data) {
    var template = require(`../templates/${name}.hbs`);
    $('section[data-main]').html(template(data));
  }

  setting(name) {
    return this.metadata.settings[name];
  }

  store(name, val) {
    var key = `app_install_${this.metadata.installationId}_${name}`;
    if (val !== undefined) {
      localStorage.setItem(key, val);
    } else {
      return localStorage.getItem(key);
    }
  }
}

export default MigrationHelper;
