module.exports = function (devDependencies) {
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
