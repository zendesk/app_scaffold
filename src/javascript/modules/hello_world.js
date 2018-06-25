/**
 *  Example module
 **/

import I18n from '../../lib/i18n'
import {resizeContainer} from '../../lib/helpers'
import getDefaultTemplate from '../../templates/default'
import '../../index.css'

const MESSAGE = 'Hello World!'
const MAX_HEIGHT = 1000

class HelloWorld {
  constructor (client, appData, config) {
    this._client = client
    this._appData = appData
    this._config = config

    // makes testing easier
    this._initializePromise = this._init()
  }

  async _init () {
    // retrieve initialization data
    const currentUser = (await this._client.get('currentUser')).currentUser
    I18n.loadTranslations(currentUser.locale)
    this._ticket = (await this._client.get('ticket')).ticket

    // render application markup
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
}

export default HelloWorld
