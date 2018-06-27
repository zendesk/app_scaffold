/**
 *  Example module
 **/

import I18n from '../../lib/i18n'
import { resizeContainer } from '../../lib/helpers'
import getDefaultTemplate from '../../templates/default'
import '../../index.css'

const MESSAGE = 'Hello World!'
const MAX_HEIGHT = 1000

class DefaultModule {
  constructor (client, appData, config) {
    this._client = client
    this._appData = appData
    this._config = config

    this._states = {
      welcomeMessage: MESSAGE
    }

    // makes testing easier
    this._initializePromise = this._init()
  }

  async _init () {
    // retrieve initialization data
    this._currentUser = (await this._client.get('currentUser')).currentUser
    I18n.loadTranslations(this._currentUser.locale)
    this._ticket = (await this._client.get('ticket')).ticket

    // render application markup
    Object.assign(
      this._states,
      {
        welcomeMessage: `${MESSAGE}, ${this._currentUser.name}`,
        lastTicketDescription: await this._getLastTicketDescription().catch(this._handleError.bind(this))
      }
    )

    await this._render('.loader', getDefaultTemplate)
    this._appContainer = document.querySelector('.example-app')
  }

  /**
   * Render template
   * @param {String} replacedNodeSelector selector of the node to be replaced
   * @param {Function} getTemplate function to generate the new Node
   * @return {Promise} will resolved after resize
   */
  _render (replacedNodeSelector, getTemplate) {
    const fragment = document.createRange().createContextualFragment(getTemplate(this._states))
    const replacedNode = document.querySelector(replacedNodeSelector)
    replacedNode.parentNode.replaceChild(fragment, replacedNode)
    return resizeContainer(this._client, MAX_HEIGHT)
  }

  // Example function accessing data from the REST API
  // See https://developer.zendesk.com/rest_api/docs/core/introduction
  async _getLastTicketDescription () {
    const ticketData = await this._client
      .request(`/api/v2/users/${this._currentUser.id}/tickets/requested.json?sort_by=created_at&sort_order=desc&per_page=1`)

    console.log('something')
    return ticketData.tickets[0].description
  }

  _handleError (error) {
    console.error(error)
    console.error('There was an error: ', error.status)
    console.error(error.responseJSON)
  }
}

export default DefaultModule
