import $ from 'jquery';
import _ from 'lodash';

class View {
  constructor(opts) {
    this.onRender = opts.onRender;
  }

  renderTemplate(name, data) {
    let template = require(`../../src/templates/${name}.hdbs`);
    return template(data);
  }

  switchTo(name, data) {
    $('[data-main]').html(this.renderTemplate(name, data));
    _.isFunction(this.onRender) && this.onRender();
  }
}

export default View;
