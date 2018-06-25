export function resizeContainer (client, max = Number.POSITIVE_INFINITY) {
  const newHeight = Math.min(document.body.clientHeight, max)
  return client.invoke('resize', { height: newHeight })
}

export function templatingLoop (set, getTemplate, initialValue = '') {
  return set.reduce((accumulator, item) => {
    return `${accumulator}${getTemplate(item)}`
  }, initialValue)
}

export function escapeSpecialChars (str) {
  if (!str || typeof str !== 'string') return ''
  const escape = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;',
    '=': '&#x3D;'
  }
  return str.replace(/[&<>"'`=]/g, function (m) { return escape[m] })
}
