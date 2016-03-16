import $ from 'jquery';

function noop() {}

function resolveHandler(app, name) {
  var handler = app.events[name];
  if (!handler) { return noop; }
  return _.isFunction(handler) ? handler.bind(app) : app[handler].bind(app);
}

function bindEvents(app) {
  _.each(app.events, function(fn, key) {
    var splittedKey = key.split(' '),
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

function BaseApp(zafClient) {
  this.zafClient = zafClient;
  this.bindEvents();

  var onCreated = resolveHandler(this, 'app.created');
  onCreated();
}

BaseApp.prototype = {
  // These are public APIs of the framework that we are shimming to make it
  // easier to migrate existing apps
  events: {},
  requests: {},

  bindEvents: function() {
    bindEvents(this);
  },

  ajax: function(name) {
    var req = this.requests[name],
        doneCallback = resolveHandler(this, name + '.done'),
        failCallback = resolveHandler(this, name + '.fail'),
        alwaysCallback = resolveHandler(this, name + '.always'),
        options = _.isFunction(req) ? req.apply(this, Array.prototype.slice.call(arguments, 1)) : req;

    return this.zafClient.request(options)
                         .then(doneCallback, failCallback)
                         .then(alwaysCallback, alwaysCallback);
  },

  renderTemplate: function(name, data) {
    var template = require(`../templates/${name}.hdbs`);
    return template(data);
  },

  switchTo: function(name, data) {
    this.$('[data-main]').html(this.renderTemplate(name, data));
  },

  $: function() {
    var args = Array.prototype.slice.call(arguments, 0);
    if (!args.length) return $('body');
    return $.apply($, arguments);
  }
}

export default BaseApp;
