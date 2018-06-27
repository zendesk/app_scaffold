import DefaultModule from '../modules/default_module'
// new ticket sidebar specific configs
const configs = {}
export default class extends DefaultModule {
  constructor (client, data) {
    super(client, data, configs)
  }
}
