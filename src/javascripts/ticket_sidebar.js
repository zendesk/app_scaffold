import BaseApp from './base_app';

var App = {
  events: {
    'app.created': 'init'
  },

  init: function() {
    this.switchTo('main', { user: 'world' });
  }
}

export default BaseApp.extend(App);
