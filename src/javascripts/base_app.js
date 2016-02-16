class BaseApp {
  render(name, data) {
    var template = require(`../templates/${name}.hbs`);
    $('section[data-main]').html(template(data));
  }
}

export default BaseApp;
