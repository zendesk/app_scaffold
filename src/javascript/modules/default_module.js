/**
 *  Example module
 **/

import I18n from '../../javascript/lib/i18n'
import { resizeContainer } from '../../javascript/lib/helpers'
import getDefaultTemplate from '../../templates/default'
import '../../index.css'

const MAX_HEIGHT = 1000
const API_ENDPOINTS = {
  organizations: '/api/v2/organizations.json'
}

class DefaultModule {
  constructor (client, appData, config) {
    this._client = client
    this._appData = appData
    this._config = config

    this._states = {}

    this._initializePromise = this._init()
  }

  async _init () {
    this._currentUser = (await this._client.get('currentUser')).currentUser
    this._states.currentUserName = this._currentUser.name

    // TODO: Do something useful with translations once Webpack loader / plugin are fixed
    // I18n.loadTranslations(this._currentUser.locale)

    let organizations = await this._client
      .request(API_ENDPOINTS.organizations)
      .catch(this._handleError.bind(this))

    if (organizations) {
      this._states.organizations = organizations.organizations

      // render application markup
      await this._render('.loader', getDefaultTemplate)
      this._appContainer = document.querySelector('.example-app')
    }
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

  _handleError (error) {
    console.error('There was an error: ', error.responseJSON)
  }
}

export default DefaultModule
