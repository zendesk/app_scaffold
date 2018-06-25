/* eslint-env jest, browser */
import HelloWorld from '../src/javascript/modules/hello_world'

jest.mock('../src/lib/i18n', () => {
  return {
    loadTranslations: () => {},
    t: () => 'translation...'
  }
})

if (!document.createRange) {
  createRangePolyfill()
}

describe('Search App', () => {
  describe('Initialization Failure', () => {
    let app
    beforeEach((done) => {
      document.body.innerHTML = '<section data-main><img class="loader" src="dot.gif"/></section>'
      CLIENT.request = jest.fn()
        .mockReturnValueOnce(Promise.reject({responseText: '{"description": "fake error"}'}))
      app = new Search(CLIENT, APPDATA_WITH_CF, CONFIG)
      app._initializePromise.then(() => {
        done()
      })
    })

    it('should render error message', () => {
      expect(app._states.isError).toBe(true)
      expect(app._states.error.message).toBe('fake error')
    })
  })
})
