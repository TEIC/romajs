import expect from 'expect'
import fs from 'fs'
import romajsApp from './combinedReducers'

const customization = fs.readFileSync('test/fakeData/bare.json', 'utf-8')
const localsource = fs.readFileSync('test/fakeData/p5subset.json', 'utf-8')
let customJSON = null
let localJSON = null

describe('ODD elements operation reducers', () => {
  it('should handle UPDATE_ELEMENT_DOCS (desc)', () => {
    customJSON = JSON.parse(customization)
    localJSON = JSON.parse(localsource)
    const state = romajsApp({
      odd: {
        customization: { isFetching: false, json: customJSON },
        localsource: { isFetching: false, json: localJSON }
      },
      selectedOdd: ''
    }, {
      type: 'UPDATE_ELEMENT_DOCS',
      element: 'sourceDesc',
      docEl: 'desc',
      content: 'new desc',
      index: 0
    })
    expect(state.odd.customization.json.elements.filter(
      x => (x.ident === 'sourceDesc')
    )[0].desc[0]).toEqual('new desc')
  })

  it('should handle ADD_ELEMENT_MODEL_CLASS', () => {
    customJSON = JSON.parse(customization)
    localJSON = JSON.parse(localsource)
    const state = romajsApp({
      odd: {
        customization: { isFetching: false, json: customJSON },
        localsource: { isFetching: false, json: localJSON }
      },
      selectedOdd: ''
    }, {
      type: 'ADD_ELEMENT_MODEL_CLASS',
      element: 'div',
      className: 'model.pLike'
    })
    expect(state.odd.customization.json.elements.filter(
      x => (x.ident === 'div')
    )[0].classes.model.indexOf('model.pLike')).toEqual(1)
  })

  it('should handle DELETE_ELEMENT_MODEL_CLASS', () => {
    customJSON = JSON.parse(customization)
    localJSON = JSON.parse(localsource)
    const state = romajsApp({
      odd: {
        customization: { isFetching: false, json: customJSON },
        localsource: { isFetching: false, json: localJSON }
      },
      selectedOdd: ''
    }, {
      type: 'DELETE_ELEMENT_MODEL_CLASS',
      element: 'div',
      className: 'model.divLike'
    })
    expect(state.odd.customization.json.elements.filter(
      x => (x.ident === 'div')
    )[0].classes.model.length).toEqual(0)
  })

  it('should handle ADD_ELEMENT_ATTRIBUTE_CLASS', () => {
    customJSON = JSON.parse(customization)
    localJSON = JSON.parse(localsource)
    const state = romajsApp({
      odd: {
        customization: { isFetching: false, json: customJSON },
        localsource: { isFetching: false, json: localJSON }
      },
      selectedOdd: ''
    }, {
      type: 'ADD_ELEMENT_ATTRIBUTE_CLASS',
      element: 'div',
      className: 'att.fragmentable'
    })
    expect(state.odd.customization.json.elements.filter(
      x => (x.ident === 'div')
    )[0].classes.atts.indexOf('att.fragmentable')).toEqual(4)
  })

  it('should handle DELETE_ELEMENT_ATTRIBUTE_CLASS', () => {
    customJSON = JSON.parse(customization)
    localJSON = JSON.parse(localsource)
    const state = romajsApp({
      odd: {
        customization: { isFetching: false, json: customJSON },
        localsource: { isFetching: false, json: localJSON }
      },
      selectedOdd: ''
    }, {
      type: 'DELETE_ELEMENT_ATTRIBUTE_CLASS',
      element: 'div',
      className: 'att.written'
    })
    expect(state.odd.customization.json.elements.filter(
      x => (x.ident === 'div')
    )[0].classes.atts.indexOf('att.written')).toEqual(-1)
  })

  it('should handle DELETE_ELEMENT_ATTRIBUTE_CLASS (inherited class)', () => {
    customJSON = JSON.parse(customization)
    localJSON = JSON.parse(localsource)
    const state = romajsApp({
      odd: {
        customization: { isFetching: false, json: customJSON },
        localsource: { isFetching: false, json: localJSON }
      },
      selectedOdd: ''
    }, {
      type: 'DELETE_ELEMENT_ATTRIBUTE_CLASS',
      element: 'div',
      className: 'att.global.rendition'
    })
    expect(state.odd.customization.json.elements.filter(
      x => (x.ident === 'div')
    )[0].attributes[0].mode).toEqual('delete')
  })

  it('should handle RESTORE_ELEMENT_ATTRIBUTE_CLASS', () => {
    customJSON = JSON.parse(customization)
    localJSON = JSON.parse(localsource)
    const firstState = romajsApp({
      odd: {
        customization: { isFetching: false, json: customJSON },
        localsource: { isFetching: false, json: localJSON }
      },
      selectedOdd: ''
    }, {
      type: 'DELETE_CLASS_ATTRIBUTE',
      element: 'div',
      className: 'att.global.rendition',
      attName: 'rend'
    })
    const state = romajsApp(firstState, {
      type: 'RESTORE_ELEMENT_ATTRIBUTE_CLASS',
      deletedAttributes: [],
      element: 'div',
      className: 'att.global.rendition',
    })
    expect(state.odd.customization.json.elements.filter(
      x => (x.ident === 'div')
    )[0].attributes.filter(x => (x.ident === 'rendition'))[0]).toNotExist()
  })

  it('should handle DELETE_CLASS_ATTRIBUTE', () => {
    customJSON = JSON.parse(customization)
    localJSON = JSON.parse(localsource)
    const state = romajsApp({
      odd: {
        customization: { isFetching: false, json: customJSON },
        localsource: { isFetching: false, json: localJSON }
      },
      selectedOdd: ''
    }, {
      type: 'DELETE_CLASS_ATTRIBUTE',
      element: 'div',
      className: 'att.global.rendition',
      attName: 'rend'
    })
    expect(state.odd.customization.json.elements.filter(
      x => (x.ident === 'div')
    )[0].attributes.filter(x => (x.ident === 'rend'))[0].mode).toEqual('delete')
  })

  it('should handle RESTORE_CLASS_ATTRIBUTE', () => {
    customJSON = JSON.parse(customization)
    localJSON = JSON.parse(localsource)
    const firstState = romajsApp({
      odd: {
        customization: { isFetching: false, json: customJSON },
        localsource: { isFetching: false, json: localJSON }
      },
      selectedOdd: ''
    }, {
      type: 'DELETE_CLASS_ATTRIBUTE',
      element: 'div',
      className: 'att.global.rendition',
      attName: 'rend'
    })
    const state = romajsApp(firstState, {
      type: 'RESTORE_CLASS_ATTRIBUTE',
      element: 'div',
      attName: 'rend'
    })
    expect(state.odd.customization.json.elements.filter(
      x => (x.ident === 'div')
    )[0].attributes.filter(x => (x.ident === 'rend'))[0]).toNotExist()
  })

  it('should handle CHANGE_CLASS_ATTRIBUTE', () => {
    customJSON = JSON.parse(customization)
    localJSON = JSON.parse(localsource)
    const state = romajsApp({
      odd: {
        customization: { isFetching: false, json: customJSON },
        localsource: { isFetching: false, json: localJSON }
      },
      selectedOdd: ''
    }, {
      type: 'CHANGE_CLASS_ATTRIBUTE',
      element: 'div',
      className: 'att.global.rendition',
      attName: 'rend'
    })
    expect(state.odd.customization.json.elements.filter(
      x => (x.ident === 'div')
    )[0].attributes.filter(x => (x.ident === 'rend'))[0].mode).toEqual('change')
  })
})
