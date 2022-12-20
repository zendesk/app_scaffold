/* eslint-env jest, browser */
import App from '../src/javascripts/modules/app'
import i18n from '../src/javascripts/lib/i18n'
import { CLIENT, ORGANIZATIONS } from './mocks/mock'
import { unmountComponentAtNode } from 'react-dom'
import { act } from 'react-dom/test-utils'
import { configure } from '@testing-library/react'
import { screen } from '@testing-library/dom'

const mockEN = {
  'app.name': 'Example App',
  'app.title': 'Example App',
  'default.organizations': 'organizations'
}

describe('Example App', () => {
  beforeAll(() => {
    configure({ testIdAttribute: 'data-test-id' })

    i18n.loadTranslations('en')

    jest.mock('../src/translations/en', () => {
      return mockEN
    })
  })

  describe('Rendering', () => {
    let appContainer = null

    beforeEach(() => {
      appContainer = document.createElement('section')
      appContainer.classList.add('main')
      document.body.appendChild(appContainer)
    })

    afterEach(() => {
      unmountComponentAtNode(appContainer)
      appContainer.remove()
      appContainer = null
    })

    it('render with current username and organizations successfully', (done) => {
      act(() => {
        CLIENT.request = jest.fn().mockReturnValueOnce(Promise.resolve(ORGANIZATIONS))
        CLIENT.invoke = jest.fn().mockReturnValue(Promise.resolve({}))

        const app = new App(CLIENT, {})
        app.initializePromise.then(() => {
          const descriptionElement = screen.getByTestId('sample-app-description')
          expect(descriptionElement.textContent).toBe('Hi Sample User, this is a sample app')

          const organizations = screen.getByTestId('organizations')
          expect(organizations.childElementCount).toBe(2)

          const organizationA = screen.getByTestId('organization-1')
          expect(organizationA.textContent).toBe('Organization A')
          const organizationB = screen.getByTestId('organization-2')
          expect(organizationB.textContent).toBe('Organization B')
          done()
        })
      })
    })

    it('render with current username but no organizations since api errors', (done) => {
      act(() => {
        CLIENT.request = jest.fn().mockReturnValueOnce(Promise.reject(new Error('a fake error')))
        const app = new App(CLIENT, {})
        const errorSpy = jest.spyOn(app, '_handleError')

        app.initializePromise.then(() => {
          const descriptionElement = screen.getByTestId('sample-app-description')
          expect(descriptionElement.textContent).toBe('Hi Sample User, this is a sample app')

          const organizations = screen.getByTestId('organizations')
          expect(organizations.childElementCount).toBe(0)

          expect(errorSpy).toBeCalled()

          done()
        })
      })
    })
  })
})
