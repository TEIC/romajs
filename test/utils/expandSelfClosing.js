import expect from 'expect'
import expandSelfClosing from '../../src/utils/expandSelfClosing'

describe('expandSelfClosing', () => {
  it('should expand a self closing element with no attributes', () => {
    expect(expandSelfClosing('<desc/>')).toEqual('<desc></desc>')
  })

  it('should expand a self closing element keeping its attributes', () => {
    const input = '<desc xmlns="http://www.tei-c.org/ns/1.0" versionDate="2005-10-10" xml:lang="en"/>'
    const expected = '<desc xmlns="http://www.tei-c.org/ns/1.0" versionDate="2005-10-10" xml:lang="en"></desc>'
    expect(expandSelfClosing(input)).toEqual(expected)
  })

  it('should expand a self closing valDesc', () => {
    expect(expandSelfClosing('<valDesc versionDate="2020-01-01"/>')).toEqual(
      '<valDesc versionDate="2020-01-01"></valDesc>')
  })

  it('should leave an already expanded desc untouched', () => {
    const input = '<desc xmlns="http://www.tei-c.org/ns/1.0">plain text</desc>'
    expect(expandSelfClosing(input)).toEqual(input)
  })

  it('should not discard content around a nested self closing tag', () => {
    const input = '<desc xmlns="http://www.tei-c.org/ns/1.0">a <lb/> b</desc>'
    expect(expandSelfClosing(input)).toEqual(input)
  })

  it('should not discard content when the desc ends with a self closing tag', () => {
    const input = '<desc>see <ref target="#x"/></desc>'
    expect(expandSelfClosing(input)).toEqual(input)
  })
})
