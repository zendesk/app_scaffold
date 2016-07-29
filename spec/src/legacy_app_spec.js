import ZAFClient from 'zendesk_app_framework_sdk';
import LegacyApp from '../../src/javascripts/legacy_app';

describe('LegacyApp', () => {
  let app;

  beforeEach(() => {
    let client = ZAFClient.init();
    app = new LegacyApp(client, {});
    spyOn(app, 'switchTo');
  });

  it('bar', () => {
    var data = { user: 'Mikkel' };
    app.renderMain(data);
    expect(app.switchTo).toHaveBeenCalledWith('main', data.user);
  });
});
