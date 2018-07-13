/**
 *  Example ticket sidebar app
 **/

import I18n from '../../javascript/lib/i18n'
import { resizeContainer, render } from '../../javascript/lib/helpers'
import getDefaultTemplate from '../../templates/default'

const MAX_HEIGHT = 1000
const API_ENDPOINTS = {
  organizations: '/api/v2/organizations.json'
}

class TicketSidebar {
  constructor (client, appData, config) {
    this._client = client
    this._appData = appData
    this._config = config

    this._states = {}

    this._initializePromise = this._init()
  }

  /**
   * Initialize module, render main template
   */
  async _init () {
    const currentUser = (await this._client.get('currentUser')).currentUser
    this._states.currentUserName = currentUser.name

    I18n.loadTranslations(currentUser.locale)

    const organizations = await this._client
      .request(API_ENDPOINTS.organizations)
      .catch(this._handleError.bind(this))

    if (organizations) {
      this._states.organizations = organizations.organizations

      // render application markup
      render('.loader', getDefaultTemplate(this._states))
      return resizeContainer(this._client, MAX_HEIGHT)
    }
  }

  /**
   * Handle error
   * @param {Object} error error object
   */
  _handleError (error) {
    console.error('There was an error: ', error.responseJSON)
  }
}

export default TicketSidebar
