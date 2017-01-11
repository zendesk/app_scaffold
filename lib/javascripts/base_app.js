import _ from 'lodash';
import $ from 'jquery';
import Handlebars from 'handlebars';
import I18n from './i18n';
import View from './view'
import Storage from './storage'

const MAX_HEIGHT = 375;

function noop() {}

// helper to resolve an event handler for an app
function resolveHandler(app, name) {
  let handler = app.events[name];
  if (!handler) { return noop; }
  return _.isFunction(handler) ? handler.bind(app) : app[handler].bind(app);
}

// Binds DOM events using jQuery and Framework events using `zafClient.on`
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

// Defines `setting`, `store` and `spinner` helpers
// See https://developer.zendesk.com/apps/docs/agent/templates#framework-helpers
function registerHelpers(app) {
  ['setting', 'store'].forEach(function(api) {
    Handlebars.registerHelper(api, function(key) {
      return app[api](key);
    });
  });

  Handlebars.registerHelper('spinner', function() {
    return new Handlebars.SafeString(`<div class="spinner dotted"></div>`);
  });
}

function BaseApp(zafClient, data) {
  this.zafClient = zafClient;

  // Defines I18n (internationalization) API
  // See https://developer.zendesk.com/apps/docs/agent/i18n
  this.I18n = { t: I18n.t };

  registerHelpers(this);
  bindEvents(this);

  this._metadata = data.metadata;
  this._context = data.context;
  this._storage = new Storage(this._metadata.installationId);

  let view = new View({ afterRender: () => {
    // automatically resize the iframe based on document height
    let newHeight = Math.min($('html').height(), MAX_HEIGHT);
    this.zafClient.invoke('resize', { height: newHeight, width: '100%' });
  }});

  // Defines `switchTo` API
  // See https://developer.zendesk.com/apps/docs/agent/interface#this.switchtotemplatename-data
  this.switchTo = view.switchTo.bind(view);

  // Defines `renderTemplate` API
  // https://developer.zendesk.com/apps/docs/agent/interface#this.rendertemplatetemplatename-data
  this.renderTemplate = view.renderTemplate.bind(view);

  // Switches to `defaultState` if defined on the prototype
  // See https://developer.zendesk.com/apps/docs/agent/templates#switching-templates
  if (this.defaultState) {
    view.switchTo(this.defaultState);
  }

  // Trigger initial events
  let evt = { firstLoad: true };
  resolveHandler(this, 'app.created')();
  resolveHandler(this, 'app.activated')(evt, evt);

  // Trigger app.willDestroy if the iframe is destroyed
  $(window).unload(() => {
    resolveHandler(this, 'app.willDestroy')();
  });
}

BaseApp.prototype = {
  // These are public APIs of the v1 framework that we are shimming to make it
  // easier to migrate existing v1 apps. See the respective links for the relevant docs.

  // https://developer.zendesk.com/apps/docs/agent/events
  events: {},

  // https://developer.zendesk.com/apps/docs/agent/requests#define-a-request
  requests: {},

  // https://developer.zendesk.com/apps/docs/agent/data#id
  id: function() {
    return this._metadata.appId;
  },

  // https://developer.zendesk.com/apps/docs/agent/data#installationid
  installationId: function() {
    return this._metadata.installationId;
  },

  // https://developer.zendesk.com/apps/docs/agent/data#guid
  guid: function() {
    return this._context.instanceGuid;
  },

  // https://developer.zendesk.com/apps/docs/agent/interface#this.currentlocation
  currentLocation: function() {
    return this._context.location;
  },

  // https://developer.zendesk.com/apps/docs/agent/requests#make-a-request
  ajax: function(name) {
    let req = this.requests[name],
        options = _.isFunction(req) ? req.apply(this, Array.prototype.slice.call(arguments, 1)) : req,
        dfd = $.Deferred(),
        app = this;

    let alwaysCallback = resolveHandler(this, name + '.always');

    let doneCallback = function() {
      dfd.resolveWith(app, arguments);
      resolveHandler(app, name + '.done').apply(null, arguments);
      alwaysCallback.apply(null, arguments);
    };

    let failCallback = function() {
      dfd.rejectWith(app, arguments);
      resolveHandler(app, name + '.fail').apply(null, arguments);
      alwaysCallback.apply(null, arguments);
    };

    this.zafClient.request(options).then(doneCallback, failCallback);

    return dfd.promise();
  },

  // https://developer.zendesk.com/apps/docs/agent/promises
  promise: function(fn) {
    if (!_.isFunction(fn)) { throw new Error('`promise` needs to be passed a Function'); }
    var dfd = $.Deferred();
    _.defer(fn.bind(this, dfd.resolve.bind(dfd), dfd.reject.bind(dfd)));
    return dfd.promise();
  },

  // https://developer.zendesk.com/apps/docs/agent/promises
  when: function() {
    return $.when.apply($, arguments);
  },

  // https://developer.zendesk.com/apps/docs/agent/interface#this.selector
  $: function() {
    let args = Array.prototype.slice.call(arguments, 0);
    if (!args.length) return $('body');
    return $.apply($, arguments);
  },

  // https://developer.zendesk.com/apps/docs/agent/data#setting
  setting: function(name) {
    return this._metadata.settings[name];
  },

  // https://developer.zendesk.com/apps/docs/agent/storage#javascript-api
  store: function(keyOrObject, value) {
    if (arguments.length === 1) {
      return this._storage.get(keyOrObject);
    }

    this._storage.set(keyOrObject, value);
  }
}

// helper to create a subclass of BaseApp with the passed prototype
BaseApp.extend = function(appPrototype) {
  let App = function(client, data) {
    BaseApp.call(this, client, data);
  };

  App.prototype = _.extend({}, BaseApp.prototype, appPrototype);

  return App;
};

export default BaseApp;
