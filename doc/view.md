## Using the View module

**This document does not apply to apps that are migrated from v1 of the Zendesk
App Framework.**

The View module provides methods to simplify rendering Handlebars templates located under the templates folder.

## Reference

### constructor

#### Arguments

* `options`: Options object to configure the view. Supported options:
  - `afterRender` (optional): Callback that is invoked whenever `switchTo` is called.

```javascript
import View from 'view';

const view = new View();
```

`afterRender` example:

```javascript
const MAX_HEIGHT = 375;
const client = ZAFClient.init();

// automatically resize the iframe based on document height whenever switching the template
const view = new View({ afterRender() {
  let newHeight = Math.min($('html').height(), MAX_HEIGHT);
  client.invoke('resize', { height: newHeight, width: '100%' });
}});
```

### view.renderTemplate(name, data)

#### Arguments

* `name`: the name of the template (same as its filename without extension).
* `data`: data object to be passed to the template.

#### Returns
The rendered template as a html string.

```html
<!-- templates/user_template.hdbs -->
<p>Hello, {{name}}!</p>
```

```javascript
view.renderTemplate('user_template', { name: 'Mikkel' }); // "<p>Hello, Mikkel!</p>"
```

### view.switchTo(name, data)
Updates the contents of the [section element within your app's layout](https://github.com/zendesk/app_scaffold/blob/b991264bdf5973da22be4d58708987817f97af43/lib/templates/layout.hdbs#L11) with the rendered template.

#### Arguments

* `name`: the name of the template (same as its filename without extension).
* `data`: data object to be passed to the template.

```javascript
view.switchTo('user_template', { name: 'Mikkel' });
```
