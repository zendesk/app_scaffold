/* eslint-env jest */
const { getGardenLink } = require('../scripts/exports')

describe('getGardenLink', () => {
  it('should return empty string if devDependencies is undefined', () => {
    expect(getGardenLink()).toEqual('')
  })

  it('should return empty string if devDependencies is null', () => {
    expect(getGardenLink(null)).toEqual('')
  })

  it('should build correct jsdelivr url for @zendeskgarden components included in the package.json', () => {
    const mockDevDependencies = {
      "@zendeskgarden/css-bedrock": "^7.0.3",
      "@zendeskgarden/css-buttons": "^6.1.2",
      "@zendeskgarden/css-callouts": "^3.1.1",
      "@zendeskgarden/css-forms": "^6.1.1",
      "@zendeskgarden/css-utilities": "^3.1.1",
      "standard": "^11.0.1",
      "webpack-visualizer-plugin": "^0.1.11"
    }

    expect(getGardenLink(mockDevDependencies)).toBe('https://cdn.jsdelivr.net/combine/npm/@zendeskgarden/css-bedrock@7.0,npm/@zendeskgarden/css-buttons@6.1,npm/@zendeskgarden/css-callouts@3.1,npm/@zendeskgarden/css-forms@6.1,npm/@zendeskgarden/css-utilities@3.1')
  })
})
