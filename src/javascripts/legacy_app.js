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
    'app.willDestroy': 'logClosedApp'
  },

  init: function() {
    this.ajax('getMe');
  },

  renderMain: function(data) {
    this.switchTo('main', data.user);
  },

  logClosedApp: function() {
    console.log('About to close the app.');
  }
}

export default BaseApp.extend(App);
