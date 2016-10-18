import ZAFClient from 'zendesk_app_framework_sdk';
import LegacyApp from '../../src/javascripts/legacy_app';

describe('LegacyApp', () => {
  let app;

  beforeEach(() => {
    let client = ZAFClient.init();
    app = new LegacyApp(client, { metadata: {}, context: {} });
  });

  describe('#renderMain', () => {
    beforeEach(() => {
      spyOn(app, 'switchTo');
    });

    it('switches to the main template', () => {
      var data = { user: 'Mikkel' };
      app.renderMain(data);
      expect(app.switchTo).toHaveBeenCalledWith('main', data.user);
    });
  });

  describe('#logClosedApp', () => {
    it('is called when the app is exiting', function() {
      spyOn(app, 'logClosedApp');
      $(window).trigger('unload');
      expect(app.logClosedApp).toHaveBeenCalled();
    });
  });
});
