/* eslint-env jest, browser */
import TicketSidebar from '../src/javascript/locations/ticket_sidebar'
import { CLIENT, ORGANIZATIONS, CONFIG, APPDATA } from './mocks/mock'
import createRangePolyfill from './polyfills/createRange'

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
  let errorSpy
  let app
  describe('Initialization Failure', () => {
    beforeEach(() => {
      document.body.innerHTML = '<section data-main><img class="loader" src="dot.gif"/></section>'
      CLIENT.request = jest.fn()
        .mockReturnValueOnce(Promise.reject(new Error('a fake error')))
      app = new TicketSidebar(CLIENT, APPDATA, CONFIG)
      errorSpy = jest.spyOn(app, '_handleError')
    })

    it('should display an error message in the console', (done) => {
      app._initializePromise.then(() => {
        expect(errorSpy).toBeCalled()
        done()
      })
    })
  })
  describe('Initialization Success', () => {
    beforeEach((done) => {
      document.body.innerHTML = '<section data-main><img class="loader" src="dot.gif"/></section>'
      CLIENT.request = jest.fn()
        .mockReturnValueOnce(Promise.resolve(ORGANIZATIONS))
      CLIENT.invoke = jest.fn().mockReturnValue(Promise.resolve({}))
      app = new TicketSidebar(CLIENT, {}, {})
      app._initializePromise.then(() => {
        done()
      })
    })

    it('should render main stage with data', () => {
      expect(document.querySelector('.example-app')).not.toBe(null)
      expect(document.querySelector('h1').textContent).toBe('Hi Sample User, this is a sample app')
      expect(document.querySelector('h2').textContent).toBe('translation...')
    })

    it('should retrieve the organizations data', () => {
      expect(app._states.organizations).toEqual([{ name: 'z3n' }])
    })
  })
})
