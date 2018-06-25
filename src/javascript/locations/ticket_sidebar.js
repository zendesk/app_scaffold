import HelloWorld from '../modules/hello_world'
// new ticket sidebar specific configs
const configs = {}
export default class extends HelloWorld {
  constructor (client, data) {
    super(client, data, configs)
  }
}
