import ZAFClient from 'zendesk_app_framework_sdk';
import BaseApp from '../../lib/javascripts/base_app';

describe('BaseApp', () => {
  let app, spy;

  beforeEach(() => {
    const client = ZAFClient.init();
    spy = jasmine.createSpy();
    const App = {
      events: {
        'app.willDestroy': 'willDestroyHandler'
      },
      willDestroyHandler: spy
    };
    const AppClass = BaseApp.extend(App);
    app = new AppClass(client, { metadata: {}, context: {} });
  });

  describe('events', () => {
    describe('app.willDestroy', function() {
      it('is called when the app is exiting', function() {
        $(window).trigger('unload');
        expect(app.willDestroyHandler).toHaveBeenCalled();
      });
    });
  });
});
