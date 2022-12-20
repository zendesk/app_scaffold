// jsdom createRange polyfill
export default () => {
  document.createRange = () => ({
    createContextualFragment: (templateString) => {
      const template = document.createElement('template')
      template.innerHTML = templateString
      return template.content
    }
  })
}
