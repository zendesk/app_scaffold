/* eslint-env jest */
import { resizeContainer, templatingLoop, render, escapeSpecialChars as escape } from '../src/javascripts/lib/helpers'
import createRangePolyfill from './polyfills/createRange'

if (!document.createRange) {
  createRangePolyfill()
}

const client = {
  invoke: jest.fn()
}
const dataSet = [1, 2, 3]
function mockGetTemplate (item) {
  return `${item}-`
}

describe('resizeContainer', () => {
  it('client.invoke has been called', () => {
    resizeContainer(client)
    expect(client.invoke).toHaveBeenCalled()
  })
})

describe('templatingLoop', () => {
  it('generate html with data set and template function', () => {
    expect(templatingLoop(dataSet, mockGetTemplate, '-')).toBe('-1-2-3-')
  })

  it('return empty string if data set and initial value is empty', () => {
    expect(templatingLoop([], mockGetTemplate)).toBe('')
  })
})

describe('render', () => {
  it('should replace target dom node with the given HTML string', () => {
    document.body.innerHTML = '<div id="placeholder"></div>'
    expect(document.querySelectorAll('#placeholder').length).toBe(1)

    render('#placeholder', '<div id="app"></div>')
    expect(document.querySelectorAll('#placeholder').length).toBe(0)
    expect(document.querySelectorAll('#app').length).toBe(1)
  })
})

describe('escapeSpecialChars', () => {
  it('should throw error if the passed in argument type is not String', function () {
    expect(() => {
      escape(1)
    }).toThrow()
  })

  it('should escape open/close html tags', () => {
    expect(escape('<script></script>')).toBe('&lt;script&gt;&lt;/script&gt;')
  })

  it('should escape ampersand', () => {
    expect(escape('a && b')).toBe('a &amp;&amp; b')
  })

  it('should escape quotes and back tick', () => {
    expect(escape('"string" \'string\' `string`')).toBe('&quot;string&quot; &#x27;string&#x27; &#x60;string&#x60;')
  })

  it('should escape equal sign', () => {
    expect(escape('a = b')).toBe('a &#x3D; b')
  })

  it('should escape unsafe tags and characters', () => {
    expect(escape('Test Ticket for Text App</a><script>javascript:alret(1);</script>')).toBe('Test Ticket for Text App&lt;/a&gt;&lt;script&gt;javascript:alret(1);&lt;/script&gt;')
  })
})
