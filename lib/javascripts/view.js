import $ from 'jquery';
import _ from 'lodash';

class View {
  constructor(opts = {}) {
    this.afterRender = opts.afterRender;
  }

  renderTemplate(name, data) {
    let template = require(`../../src/templates/${name}.hdbs`);
    return template(data);
  }

  switchTo(name, data) {
    $('[data-main]').html(this.renderTemplate(name, data));
    _.isFunction(this.afterRender) && this.afterRender();
  }
}

export default View;
