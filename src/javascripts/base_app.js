import $ from 'jquery';

function BaseApp(zafClient) {
  this.zafClient = zafClient;
  this.bindEvents();

  var onCreated = this.events['app.created'];
  if (onCreated) {
    (_.isFunction(onCreated) ? onCreated : this[onCreated]).call(this);
  }
}

function resolveHandler(app, name) {
  var handler = app.events[name];
  return handler ? (_.isFunction(handler) ? handler.bind(app) : app[handler].bind(app)) : function() {};
}

BaseApp.prototype = {
  // These are public APIs of the framework that we are shimming to make it
  // easier to migrate existing apps
  events: {},
  requests: {},

  bindEvents: function() {
    _.each(this.events, function(func, key) {
      var splitted_key = key.split(' '),
          event = splitted_key[0],
          element = splitted_key[1],
          isDomEvent = !!element;

      func = resolveHandler(this, key);

      if (isDomEvent) {
        this.$(document).on(event, element, func);
      } else {
        this.zafClient.on(event, func);
      }
    }.bind(this));
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
    return $.apply($, arguments);
  }
}

export default BaseApp;
