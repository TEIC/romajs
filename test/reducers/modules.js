import expect from 'expect'
import fs from 'fs'
import romajsApp from './combinedReducers'

const customization = fs.readFileSync('test/fakeData/bare.json', 'utf-8')
const localsource = fs.readFileSync('test/fakeData/p5subset.json', 'utf-8')
let customJSON = null
let localJSON = null

describe('ODD modules operation reducers', () => {
  it('should handle INCLUDE_MODULES', () => {
    customJSON = JSON.parse(customization)
    localJSON = JSON.parse(localsource)
    const state = romajsApp({
      odd: {
        customization: { isFetching: false, json: customJSON },
        localsource: { isFetching: false, json: localJSON }
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

  it('should handle INCLUDE_MODULES and include all module elements', () => {
    customJSON = JSON.parse(customization)
    localJSON = JSON.parse(localsource)
    const state = romajsApp({
      odd: {
        customization: { isFetching: false, json: customJSON },
        localsource: { isFetching: false, json: localJSON }
      },
      selectedOdd: ''
    }, {
      type: 'INCLUDE_MODULES',
      modules: ['linking']
    })

    expect(state.odd.customization.json.elements.filter(
      x => (x.ident === 'ab')
    ).length).toEqual(1)
  })

  it('should handle EXCLUDE_MODULES', () => {
    customJSON = JSON.parse(customization)
    localJSON = JSON.parse(localsource)
    const state = romajsApp({
      odd: {
        customization: { isFetching: false, json: customJSON },
        localsource: { isFetching: false, json: localJSON }
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

  it('should handle EXCLUDE_MODULES and exclude all module elements', () => {
    customJSON = JSON.parse(customization)
    localJSON = JSON.parse(localsource)
    const state = romajsApp({
      odd: {
        customization: { isFetching: false, json: customJSON },
        localsource: { isFetching: false, json: localJSON }
      },
      selectedOdd: ''
    }, {
      type: 'EXCLUDE_MODULES',
      modules: ['header']
    })

    expect(state.odd.customization.json.elements.filter(
      x => (x.ident === 'fileDesc')
    ).length).toEqual(0)
  })

  it('should handle INCLUDE_ELEMENTS', () => {
    customJSON = JSON.parse(customization)
    localJSON = JSON.parse(localsource)
    const state = romajsApp({
      odd: {
        customization: { isFetching: false, json: customJSON, xml: '<TEI/>' },
        localsource: { isFetching: false, json: localJSON }
      },
      selectedOdd: ''
    }, {
      type: 'INCLUDE_ELEMENTS',
      elements: ['camera', 'p']
    })

    expect(state.odd.customization.json.elements.filter(
      x => (x.ident === 'p')
    ).length).toEqual(1)

    expect(state.odd.customization.json.modules.filter(
      x => (x.ident === 'drama')
    ).length).toEqual(1)
  })

  it('should handle EXCLUDE_ELEMENTS', () => {
    customJSON = JSON.parse(customization)
    localJSON = JSON.parse(localsource)
    const state = romajsApp({
      odd: {
        customization: { isFetching: false, json: customJSON },
        localsource: { isFetching: false, json: localJSON }
      },
      selectedOdd: ''
    }, {
      type: 'EXCLUDE_ELEMENTS',
      elements: ['TEI', 'back', 'body', 'div', 'front', 'text']
    })

    expect(state.odd.customization.json.elements.filter(
      x => (x.ident === 'tei')
    ).length).toEqual(0)

    expect(state.odd.customization.json.modules.filter(
      x => (x.ident === 'textstructure')
    ).length).toEqual(0)
  })

  it('should handle INCLUDE_CLASSES', () => {
    customJSON = JSON.parse(customization)
    localJSON = JSON.parse(localsource)
    const state = romajsApp({
      odd: {
        customization: { isFetching: false, json: customJSON },
        localsource: { isFetching: false, json: localJSON }
      },
      selectedOdd: ''
    }, {
      type: 'INCLUDE_CLASSES',
      classes: ['model.applicationLike'],
      classType: 'models'
    })

    expect(state.odd.customization.json.classes.models.filter(
      x => (x.ident === 'model.applicationLike')
    ).length).toEqual(1)
  })

  it('should handle EXCLUDE_CLASSES', () => {
    customJSON = JSON.parse(customization)
    localJSON = JSON.parse(localsource)
    const state = romajsApp({
      odd: {
        customization: { isFetching: false, json: customJSON },
        localsource: { isFetching: false, json: localJSON }
      },
      selectedOdd: ''
    }, {
      type: 'EXCLUDE_CLASSES',
      classes: ['model.biblLike'],
      classType: 'models'
    })

    expect(state.odd.customization.json.classes.models.filter(
      x => (x.ident === 'model.biblLike')
    ).length).toEqual(0)
  })

  it('should handle INCLUDE_DATATYPES', () => {
    customJSON = JSON.parse(customization)
    localJSON = JSON.parse(localsource)
    const state = romajsApp({
      odd: {
        customization: { isFetching: false, json: customJSON },
        localsource: { isFetching: false, json: localJSON }
      },
      selectedOdd: ''
    }, {
      type: 'INCLUDE_DATATYPES',
      datatypes: ['teidata.duration.w3c']
    })

    expect(state.odd.customization.json.datatypes.filter(
      x => (x.ident === 'teidata.duration.w3c')
    ).length).toEqual(1)
  })

  it('should handle EXCLUDE_DATATYPES', () => {
    customJSON = JSON.parse(customization)
    localJSON = JSON.parse(localsource)
    const state = romajsApp({
      odd: {
        customization: { isFetching: false, json: customJSON },
        localsource: { isFetching: false, json: localJSON }
      },
      selectedOdd: ''
    }, {
      type: 'EXCLUDE_DATATYPES',
      datatypes: ['teidata.certainty']
    })

    expect(state.odd.customization.json.datatypes.filter(
      x => (x.ident === 'teidata.certainty')
    ).length).toEqual(0)
  })
})
