export const CLIENT = {
  _origin: 'zendesk.com',
  get: (prop) => {
    switch (prop) {
      case 'currentUser': return Promise.resolve({
        currentUser: {
          locale: 'en',
          name: 'Sample User'
        }
      })
    }
  }
}

export const ORGANIZATIONS = {
  organizations: [
    { name: 'z3n' }
  ],
  next_page: null,
  previous_page: null,
  count: 1
}

export const APPDATA = {
  metadata: {
    settings: {
      setting_1: '1 2 3',
      setting_2: true
    }
  }
}

export const CONFIG = {}
