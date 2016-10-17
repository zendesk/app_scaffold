import BaseApp from 'base_app';

// add these if needed
// import Base64 from 'base64';
// import helpers from 'helpers';

var App = {

  defaultState: 'loading',

  requests: {
    getMe: {
      url: '/api/v2/users/me.json'
    }
  },

  events: {
    'app.created': 'init',
    'getMe.done': 'renderMain',
    'click .js-modalButton': 'showModal',
    'modal.close': 'logClosedModal',
    'app.willDestroy': 'storeClosedAt'
  },

  init: function() {
    if (this.currentLocation() === 'modal') {
      return this.switchTo('modal');
    }
    this.ajax('getMe');
  },

  renderMain: function(data) {
    this.switchTo('main', data.user);
  },

  showModal: function() {
    this.modal(window.location.href).then(function() {
      this.modalCount = (this.modalCount || 0) + 1;
      console.log('Modals shown: ' + this.modalCount);
    }.bind(this));
  },

  logClosedModal: function() {
    console.log('Closed a modal.');
  },

  storeClosedAt: function() {
    var closedAt = new Date();
    console.log('CLOSING', closedAt);
    this.store('lastClosedAt', closedAt);
  }
}

export default BaseApp.extend(App);
