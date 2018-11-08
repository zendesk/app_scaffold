/**
 * Generate jsdelivr url for Zendesk garden css components
 * @param {Object} devDependencies devDependencies section in project's package.json
 * @return {String} '' or jsdelivr url
 */
const getGardenLink = function (devDependencies) {
  if (!devDependencies) return ''

  const pkg = Object.keys(devDependencies).filter(item => item.includes('@zendeskgarden/css'))

  return pkg.reduce(
    (url, pkg) => {
      const version = devDependencies[pkg]
        .replace(/^[\^~]/g, '')
        .replace(/\.\d$/, '')
      url = `${url}npm/${pkg}@${version},`
      return url
    },
    'https://cdn.jsdelivr.net/combine/'
  ).slice(0, -1)
}

module.exports = {
  getGardenLink
}
