import $ from 'jquery';

class BaseApp {
  // These are public APIs of the framework that we are shimming to make it
  // easier to migrate existing apps

  renderTemplate(name, data) {
    var template = require(`../templates/${name}.hbs`);
    return template(data);
  }

  switchTo(name, data) {
    this.$('section[data-main]').html(this.renderTemplate(name, data));
  }

  $() {
    return $.apply($, arguments);
  }
}

export default BaseApp;
