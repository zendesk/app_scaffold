import ZAFClient from 'zendesk_app_framework_sdk';
import TicketSidebar from '../../src/javascripts/ticket_sidebar';

describe('TicketSidebar', () => {
  let app;

  beforeEach(() => {
    let client = ZAFClient.init();
    app = new TicketSidebar(client, { metadata: {}, context: {} });
  });

  describe('#renderMain', () => {
    beforeEach(() => {
      spyOn(app.view, 'switchTo');
    });

    it('switches to the main template', () => {
      var data = { user: 'Mikkel' };
      app.renderMain(data);
      expect(app.view.switchTo).toHaveBeenCalledWith('main', data.user);
    });
  });
});
