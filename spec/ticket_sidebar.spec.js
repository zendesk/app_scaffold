/* eslint-env jest, browser */
import TicketSidebar from '../src/javascript/locations/ticket_sidebar'
import { CLIENT, CONFIG, APPDATA_WITH_CF, createRangePolyfill } from './mocks/mock'

jest.mock('../src/javascript/lib/i18n', () => {
  return {
    loadTranslations: () => {},
    t: () => 'translation...'
  }
})

if (!document.createRange) {
  createRangePolyfill()
}

describe('Ticket Sidebar App', () => {
  describe('Initialization Failure', () => {
    let errorSpy
    let app
    beforeEach(() => {
      document.body.innerHTML = '<section data-main><img class="loader" src="dot.gif"/></section>'
      CLIENT.request = jest.fn()
        .mockReturnValueOnce(Promise.reject(new Error({
          status: 404,
          responseJSON: {'description': 'a fake error'}
        })))
      app = new TicketSidebar(CLIENT, APPDATA_WITH_CF, CONFIG)
      errorSpy = jest.spyOn(app, '_handleError')
    })

    it('should display an error message in the console', (done) => {
      app._initializePromise.then(() => {
        expect(errorSpy).toBeCalled()
        done()
      })
    })
  })
})
