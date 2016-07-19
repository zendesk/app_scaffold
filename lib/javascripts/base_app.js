import $ from 'jquery';
import I18n from './i18n';

let maxHeight = 375;

function noop() {}

function resolveHandler(app, name) {
  let handler = app.events[name];
  if (!handler) { return noop; }
  return _.isFunction(handler) ? handler.bind(app) : app[handler].bind(app);
}

function bindEvents(app) {
  _.each(app.events, function(fn, key) {
    let splittedKey = key.split(' '),
        event = splittedKey[0],
        element = splittedKey[1],
        isDomEvent = !!element,
        func = resolveHandler(app, key);

    if (isDomEvent) {
      $(document).on(event, element, func);
    } else {
      app.zafClient.on(event, func);
    }
  }.bind(app));
}

function registerHelpers(app) {
  ['setting', 'store'].forEach(function(api) {
    Handlebars.registerHelper(api, function(key) {
      return app[api](key);
    });
  });

  Handlebars.registerHelper('t', function(key, context) {
    try {
      return app.I18n.t(key, context.hash);
    } catch(e) {
      console.error(e);
      return e.message;
    }
  });
}

function BaseApp(zafClient, data) {
  this.zafClient = zafClient;
  this.I18n = { t: I18n.t.bind(null, this) };
  registerHelpers(this);
  bindEvents(this);
  let evt = { firstLoad: true };
  this._metadata = data.metadata;
  this._context = data.context;
  if (this.defaultState) {
    this.switchTo(this.defaultState);
  }
  zafClient.get('currentUser.locale').then(function(data) {
    I18n.loadTranslations(this, data['currentUser.locale']);
    resolveHandler(this, 'app.created')();
    resolveHandler(this, 'app.activated')(evt, evt);
  }.bind(this));
}

BaseApp.prototype = {
  // These are public APIs of the framework that we are shimming to make it
  // easier to migrate existing apps
  events: {},
  requests: {},

  id: function() {
    return this._metadata.appId;
  },

  installationId: function() {
    return this._metadata.installationId;
  },

  guid: function() {
    return this._context.instanceGuid;
  },

  currentLocation: function() {
    return this._context.location;
  },

  ajax: function(name) {
    let req = this.requests[name],
        doneCallback = resolveHandler(this, name + '.done'),
        failCallback = resolveHandler(this, name + '.fail'),
        alwaysCallback = resolveHandler(this, name + '.always'),
        options = _.isFunction(req) ? req.apply(this, Array.prototype.slice.call(arguments, 1)) : req;

    return this.zafClient.request(options)
                         .then(doneCallback, failCallback)
                         .then(alwaysCallback, alwaysCallback);
  },

  renderTemplate: function(name, data) {
    let template = require(`../../src/templates/${name}.hdbs`);
    return template(data);
  },

  switchTo: function(name, data) {
    this.$('[data-main]').html(this.renderTemplate(name, data));
    let newHeight = Math.min($('html').height(), maxHeight);
    this.zafClient.invoke('resize', { height: newHeight, width: '100%' });
  },

  $: function() {
    let args = Array.prototype.slice.call(arguments, 0);
    if (!args.length) return $('body');
    return $.apply($, arguments);
  },

  setting: function(name) {
    return this._metadata.settings[name];
  },

  store: function(keyOrObject, value) {
    let installationId = this._metadata.installationId;
    if (typeof keyOrObject === 'string') {
      let key = `${installationId}:${keyOrObject}`;
      if (arguments.length === 1) {
        return JSON.parse(localStorage.getItem(key));
      }
      localStorage.setItem(key, JSON.stringify(value));
    } else if (typeof keyOrObject === 'object') {
      Object.keys(keyOrObject).forEach(function(key) {
        localStorage.setItem(`${installationId}:${key}`, JSON.stringify(keyOrObject[key]));
      });
    }
  }
}

BaseApp.extend = function(appPrototype) {
  let App = function(client, data) {
    BaseApp.call(this, client, data);
  };

  App.prototype = _.extend({}, BaseApp.prototype, appPrototype);

  return App;
};

export default BaseApp;
