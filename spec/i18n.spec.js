/* eslint-env jest */
import i18n from '../src/javascripts/lib/i18n'

const mock_en = {
  'one': 'the first translation',
  'two.one': 'the second for: {{name}}',
  'two.two': 'the second for: {{name}}-{{other}}',
  'three.one.one': 'the {{name}} for {{name}} should be {{name}}'
}

jest.mock('../src/translations/en', () => {
  return mock_en
})

jest.mock('../src/translations/fr', () => {
  throw new Error('no such file')
})

describe('i18n', () => {
  beforeAll(() => {
    i18n.loadTranslations('en')
  })

  describe('#tryRequire', () => {
    it('returns a json if the file exists', () => {
      const result = i18n.tryRequire('en')
      expect(result).toBe(mock_en)
    })

    it('returns null if the file doesn\'t exist', () => {
      const result = i18n.tryRequire('fr')
      expect(result).toBe(null)
    })
  })

  describe('#t', () => {
    it('returns a string', () => {
      const result = i18n.t('one')
      expect(result).toBe('the first translation')
    })

    it('interpolates one string', () => {
      const result = i18n.t('two.one', {
        name: 'olaf'
      })
      expect(result).toBe('the second for: olaf')
    })

    it('interpolates multiple strings', () => {
      const result = i18n.t('two.two', {
        name: 'olaf',
        other: 'test'
      })
      expect(result).toBe('the second for: olaf-test')
    })

    it('interpolates duplicates strings', () => {
      const result = i18n.t('three.one.one', {
        name: 'olaf'
      })
      expect(result).toBe('the olaf for olaf should be olaf')
    })
  })
})
