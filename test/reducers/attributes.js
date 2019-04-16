import expect from 'expect'
import fs from 'fs'
import romajsApp from './combinedReducers'

const customization = fs.readFileSync('test/fakeData/bare.json', 'utf-8')
const localsource = fs.readFileSync('test/fakeData/p5subset.json', 'utf-8')
let customJSON = null
let localJSON = null

describe('ODD attributes operation reducers', () => {
  it('should handle UPDATE_ATTRIBUTE_DOCS (desc)', () => {
    customJSON = JSON.parse(customization)
    localJSON = JSON.parse(localsource)
    const state = romajsApp({
      odd: {
        customization: { isFetching: false, json: customJSON },
        localsource: { isFetching: false, json: localJSON }
      },
      selectedOdd: ''
    }, {
      type: 'UPDATE_ATTRIBUTE_DOCS',
      member: 'list',
      memberType: 'element',
      attr: 'type',
      docEl: 'desc',
      content: 'new desc',
      index: 0
    })
    expect(state.odd.customization.json.elements.filter(x => (x.ident === 'list'))[0]
      .attributes.filter(x => (x.ident === 'type'))[0].desc[0]).toEqual('new desc')
  })

  it('should handle UPDATE_ATTRIBUTE_DOCS (valItem desc)', () => {
    customJSON = JSON.parse(customization)
    localJSON = JSON.parse(localsource)
    const state = romajsApp({
      odd: {
        customization: { isFetching: false, json: customJSON },
        localsource: { isFetching: false, json: localJSON }
      },
      selectedOdd: ''
    }, {
      type: 'UPDATE_ATTRIBUTE_DOCS',
      member: 'list',
      memberType: 'element',
      attr: 'type',
      docEl: 'desc',
      content: 'new desc for valItem',
      index: 0,
      valItem: 'gloss'
    })
    expect(state.odd.customization.json.elements.filter(x => (x.ident === 'list'))[0]
      .attributes.filter(x => (x.ident === 'type'))[0].valList.valItem.filter(vl => vl.ident === 'gloss')[0].desc[0]).toEqual('new desc for valItem')
  })

  it('should handle DELETE_ATTRIBUTE_DOCS (desc)', () => {
    customJSON = JSON.parse(customization)
    localJSON = JSON.parse(localsource)
    const state = romajsApp({
      odd: {
        customization: { isFetching: false, json: customJSON },
        localsource: { isFetching: false, json: localJSON }
      },
      selectedOdd: ''
    }, {
      type: 'DELETE_ATTRIBUTE_DOCS',
      member: 'list',
      memberType: 'element',
      attr: 'type',
      docEl: 'desc',
      index: 0
    })
    expect(state.odd.customization.json.elements.filter(x => (x.ident === 'list'))[0]
      .attributes.filter(x => (x.ident === 'type'))[0].desc.length).toEqual(0)
  })

  it('should handle SET_NS', () => {
    customJSON = JSON.parse(customization)
    localJSON = JSON.parse(localsource)
    const state = romajsApp({
      odd: {
        customization: { isFetching: false, json: customJSON },
        localsource: { isFetching: false, json: localJSON }
      },
      selectedOdd: ''
    }, {
      type: 'SET_NS',
      member: 'list',
      memberType: 'element',
      attr: 'type',
      ns: 'http://example.com/'
    })
    expect(state.odd.customization.json.elements.filter(x => (x.ident === 'list'))[0]
      .attributes.filter(x => (x.ident === 'type'))[0].ns).toEqual('http://example.com/')
  })

  it('should handle SET_USAGE', () => {
    customJSON = JSON.parse(customization)
    localJSON = JSON.parse(localsource)
    const state = romajsApp({
      odd: {
        customization: { isFetching: false, json: customJSON },
        localsource: { isFetching: false, json: localJSON }
      },
      selectedOdd: ''
    }, {
      type: 'SET_USAGE',
      member: 'list',
      memberType: 'element',
      attr: 'type',
      usage: 'opt'
    })
    expect(state.odd.customization.json.elements.filter(x => (x.ident === 'list'))[0]
      .attributes.filter(x => (x.ident === 'type'))[0].usage).toEqual('opt')
  })

  it('should handle SET_USAGE (inherited att)', () => {
    customJSON = JSON.parse(customization)
    localJSON = JSON.parse(localsource)
    const firstState = romajsApp({
      odd: {
        customization: { isFetching: false, json: customJSON },
        localsource: { isFetching: false, json: localJSON }
      },
      selectedOdd: ''
    }, {
      type: 'CHANGE_CLASS_ATTRIBUTE_ON_ELEMENT',
      element: 'title',
      className: 'att.canonical',
      attName: 'key'
    })
    const state = romajsApp(firstState, {
      type: 'SET_USAGE',
      member: 'title',
      memberType: 'element',
      attr: 'key',
      usage: 'rec'
    })
    expect(state.odd.customization.json.elements.filter(x => (x.ident === 'title'))[0]
      .attributes.filter(x => (x.ident === 'key'))[0].usage).toEqual('rec')
  })

  it('should handle SET_VALLIST_TYPE', () => {
    customJSON = JSON.parse(customization)
    localJSON = JSON.parse(localsource)
    const firstState = romajsApp({
      odd: {
        customization: { isFetching: false, json: customJSON },
        localsource: { isFetching: false, json: localJSON }
      },
      selectedOdd: ''
    }, {
      type: 'RESTORE_ELEMENT_ATTRIBUTE',
      element: 'title',
      attribute: 'level'
    })
    const state = romajsApp(firstState, {
      type: 'SET_VALLIST_TYPE',
      member: 'title',
      memberType: 'element',
      attr: 'level',
      listType: 'semi'
    })
    expect(state.odd.customization.json.elements.filter(x => (x.ident === 'title'))[0]
      .attributes.filter(x => (x.ident === 'level'))[0].valList.type).toEqual('semi')
  })

  it('should handle ADD_VALITEM', () => {
    customJSON = JSON.parse(customization)
    localJSON = JSON.parse(localsource)
    const firstState = romajsApp({
      odd: {
        customization: { isFetching: false, json: customJSON },
        localsource: { isFetching: false, json: localJSON }
      },
      selectedOdd: ''
    }, {
      type: 'RESTORE_ELEMENT_ATTRIBUTE',
      element: 'title',
      attribute: 'level'
    })
    const state = romajsApp(firstState, {
      type: 'ADD_VALITEM',
      member: 'title',
      memberType: 'element',
      attr: 'level',
      value: 'newValue'
    })
    expect(state.odd.customization.json.elements.filter(x => (x.ident === 'title'))[0]
      .attributes.filter(x => (x.ident === 'level'))[0].valList
      .valItem.filter(v => v.ident === 'newValue')[0]).toExist()
  })

  it('should handle DELETE_VALITEM', () => {
    customJSON = JSON.parse(customization)
    localJSON = JSON.parse(localsource)
    const firstState = romajsApp({
      odd: {
        customization: { isFetching: false, json: customJSON },
        localsource: { isFetching: false, json: localJSON }
      },
      selectedOdd: ''
    }, {
      type: 'RESTORE_ELEMENT_ATTRIBUTE',
      element: 'title',
      attribute: 'level'
    })
    const state = romajsApp(firstState, {
      type: 'DELETE_VALITEM',
      member: 'title',
      memberType: 'element',
      attr: 'level',
      value: 'a'
    })
    expect(state.odd.customization.json.elements.filter(x => (x.ident === 'title'))[0]
      .attributes.filter(x => (x.ident === 'level'))[0].valList
      .valItem.filter(v => v.ident === 'a')[0]).toNotExist()
  })

  it('should handle SET_DATATYPE (W3C: @name)', () => {
    customJSON = JSON.parse(customization)
    localJSON = JSON.parse(localsource)
    const firstState = romajsApp({
      odd: {
        customization: { isFetching: false, json: customJSON },
        localsource: { isFetching: false, json: localJSON }
      },
      selectedOdd: ''
    }, {
      type: 'RESTORE_ELEMENT_ATTRIBUTE',
      element: 'title',
      attribute: 'level'
    })
    const state = romajsApp(firstState, {
      type: 'SET_DATATYPE',
      member: 'title',
      memberType: 'element',
      attr: 'level',
      datatype: 'string'
    })
    expect(state.odd.customization.json.elements.filter(x => (x.ident === 'title'))[0]
      .attributes.filter(x => (x.ident === 'level'))[0].datatype.dataRef.name).toEqual('string')
  })

  it('should handle SET_DATATYPE (@key)', () => {
    customJSON = JSON.parse(customization)
    localJSON = JSON.parse(localsource)
    const firstState = romajsApp({
      odd: {
        customization: { isFetching: false, json: customJSON },
        localsource: { isFetching: false, json: localJSON }
      },
      selectedOdd: ''
    }, {
      type: 'RESTORE_ELEMENT_ATTRIBUTE',
      element: 'title',
      attribute: 'level'
    })
    const state = romajsApp(firstState, {
      type: 'SET_DATATYPE',
      member: 'title',
      memberType: 'element',
      attr: 'level',
      datatype: 'teidata.text'
    })
    expect(state.odd.customization.json.elements.filter(x => (x.ident === 'title'))[0]
      .attributes.filter(x => (x.ident === 'level'))[0].datatype.dataRef.key).toEqual('teidata.text')
  })

  it('should handle SET_DATATYPE_RESTRICTION', () => {
    customJSON = JSON.parse(customization)
    localJSON = JSON.parse(localsource)
    const firstState = romajsApp({
      odd: {
        customization: { isFetching: false, json: customJSON },
        localsource: { isFetching: false, json: localJSON }
      },
      selectedOdd: ''
    }, {
      type: 'RESTORE_ELEMENT_ATTRIBUTE',
      element: 'title',
      attribute: 'level'
    })
    const state = romajsApp(firstState, {
      type: 'SET_DATATYPE_RESTRICTION',
      member: 'title',
      memberType: 'element',
      attr: 'level',
      value: '[ab]'
    })
    expect(state.odd.customization.json.elements.filter(x => (x.ident === 'title'))[0]
      .attributes.filter(x => (x.ident === 'level'))[0].datatype.dataRef.restriction).toEqual('[ab]')
  })
})
