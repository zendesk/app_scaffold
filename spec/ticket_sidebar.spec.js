/* eslint-env jest, browser */
import TicketSidebar from '../src/javascript/locations/ticket_sidebar'
import { CLIENT, ORGANIZATIONS } from './mocks/mock'
import createRangePolyfill from './polyfills/createRange'

jest.mock('../src/javascript/lib/i18n', () => {
  return {
    loadTranslations: jest.fn(),
    t: str => str
  }
})

if (!document.createRange) {
  createRangePolyfill()
}

describe('Ticket Sidebar App', () => {
  let errorSpy
  let app
  describe('Initialization Failure', () => {
    beforeEach((done) => {
      document.body.innerHTML = '<section data-main><img class="loader" src="dot.gif"/></section>'
      CLIENT.request = jest.fn()
        .mockReturnValueOnce(Promise.reject(new Error('a fake error')))
      app = new TicketSidebar(CLIENT, {}, {})
      errorSpy = jest.spyOn(app, '_handleError')
      app._initializePromise.then(() => {
        done()
      })
    })

    it('should display an error message in the console', () => {
      expect(errorSpy).toBeCalled()
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
      expect(document.querySelector('h2').textContent).toBe('default.organizations:')
    })

    it('should retrieve the organizations data', () => {
      expect(app._states.organizations).toEqual([
        { name: 'Organization A' },
        { name: 'Organization B' }
      ])
    })
  })
})
