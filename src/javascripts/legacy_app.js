import BaseApp from './lib/base_app';

var App = {

  defaultState: 'loading',

  requests: {
    getMe: {
      url: '/api/v2/users/me.json'
    }
  },

  events: {
    'app.created': 'init',
    'getMe.done': 'renderMain'
  },

  init: function() {
    this.ajax('getMe');
  },

  renderMain: function(data) {
    this.switchTo('main', data.user);
  }
}

export default BaseApp.extend(App);
