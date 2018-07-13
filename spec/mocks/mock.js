/* eslint-env jest */
export const CLIENT = {
  _origin: 'zendesk.com',
  get: (prop) => {
    switch (prop) {
      case 'currentUser': return Promise.resolve({
        'currentUser': {'locale': 'en'}
      })
      case 'ticket': return Promise.resolve({
        'ticket': {
          'id': 1,
          'brand': {
            'id': 360000636152,
            'name': 'z3n'
          }
        }
      })
      case 'ticket.subject': return Promise.resolve({
        'ticket.subject': 'New Ticket Ticket'
      })
    }
    /* istanbul ignore next */
    if (Array.isArray(prop)) {
      return Promise.resolve({
        'ticket.customField:custom_field_1': 'cf_suggestion_1',
        'ticket.customField:custom_field_2': '',
        'ticket.customField:custom_field_3': 'cf_suggestion_1'
      })
    }
  },
  request: jest.fn(),
  invoke: jest.fn()
}

export const APPDATA_WITH_CF = {
  metadata: {
    settings: {
      custom_fields: '1 2 3',
      related_tickets: true
    }
  }
}

export const CONFIG = {}

// jsdom createRange polyfill
export const createRangePolyfill = () => {
  document.createRange = () => ({
    createContextualFragment: (templateString) => {
      let template = document.createElement('template')
      template.innerHTML = templateString
      return template.content
    }
  })
}
