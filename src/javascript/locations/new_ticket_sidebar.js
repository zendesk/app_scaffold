import DefaultModule from '../modules/default_module'
// ticket sidebar specific configs
const configs = {}
export default class extends DefaultModule {
  constructor (client, data) {
    super(client, data, configs)
  }
}
