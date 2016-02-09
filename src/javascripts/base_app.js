class BaseApp {
  render(name, data) {
    var template = Templates['src/templates/' + name + '.hbs'];
    $('section[data-main]').html(template(data));
  }
}

export default BaseApp;
