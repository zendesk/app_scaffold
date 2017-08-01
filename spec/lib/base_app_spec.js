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

  describe('#when', () => {
    it('works with both jQuery and native promises', (done) => {
      const promise = Promise.resolve(123)
      const dfd = $.Deferred();
      _.defer(() => dfd.resolve(456));

      app.when(promise, dfd.promise()).then((nativePromise, jQPromise) => {
        expect(nativePromise).toEqual(123);
        expect(jQPromise).toEqual(456);
        done();
      });
    });
  });
});
