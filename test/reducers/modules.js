import expect from 'expect'
import fs from 'fs'
import romajsApp from '../../src/reducers'

const customization = JSON.parse(fs.readFileSync('test/fakeData/bare.json', 'utf-8'))
const localsource = JSON.parse(fs.readFileSync('test/fakeData/p5subset.json', 'utf-8'))

describe('ODD modules operation reducers', () => {
  it('should handle INCLUDE_MODULES', () => {
    const state = romajsApp({
      odd: {
        customization: { isFetching: false, json: customization },
        localsource: { isFetching: false, json: localsource }
      },
      selectedOdd: ''
    }, {
      type: 'INCLUDE_MODULES',
      modules: ['analysis', 'core']
    })

    expect(state.odd.customization.json.modules.filter(
      x => (x.ident === 'analysis' || x.ident === 'core')
    ).length).toEqual(2)
  })

  it('should handle EXCLUDE_MODULES', () => {
    const state = romajsApp({
      odd: {
        customization: { isFetching: false, json: customization },
        localsource: { isFetching: false, json: localsource }
      },
      selectedOdd: ''
    }, {
      type: 'EXCLUDE_MODULES',
      modules: ['analysis', 'header']
    })

    expect(state.odd.customization.json.modules.filter(
      x => (x.ident === 'analysis' || x.ident === 'header')
    ).length).toEqual(0)
  })

  it('should handle INCLUDE_ELEMENTS', () => {
    const state = romajsApp({
      odd: {
        customization: { isFetching: false, json: customization },
        localsource: { isFetching: false, json: localsource }
      },
      selectedOdd: ''
    }, {
      type: 'INCLUDE_ELEMENTS',
      elements: ['msDesc', 'p']
    })

    expect(state.odd.customization.json.members.filter(
      x => (x.ident === 'msDesc' || x.ident === 'p')
    ).length).toEqual(2)

    expect(state.odd.customization.json.modules.filter(
      x => (x.ident === 'msdescription')
    ).length).toEqual(1)
  })

  it('should handle EXCLUDE_ELEMENTS', () => {
    const state = romajsApp({
      odd: {
        customization: { isFetching: false, json: customization },
        localsource: { isFetching: false, json: localsource }
      },
      selectedOdd: ''
    }, {
      type: 'EXCLUDE_ELEMENTS',
      elements: ['TEI', 'back', 'body', 'div', 'front', 'text']
    })

    expect(state.odd.customization.json.members.filter(
      x => (x.ident === 'tei')
    ).length).toEqual(0)

    expect(state.odd.customization.json.modules.filter(
      x => (x.ident === 'textstructure')
    ).length).toEqual(0)
  })
})
