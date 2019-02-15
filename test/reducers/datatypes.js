import expect from 'expect'
import fs from 'fs'
import romajsApp from './combinedReducers'

const customization = fs.readFileSync('test/fakeData/bare.json', 'utf-8')
const localsource = fs.readFileSync('test/fakeData/p5subset.json', 'utf-8')
let customJSON = null
let localJSON = null

describe('ODD datatype operations reducers', () => {
  it('should handle UPDATE_DATATYPE_DOCS (desc)', () => {
    customJSON = JSON.parse(customization)
    localJSON = JSON.parse(localsource)
    const state = romajsApp({
      odd: {
        customization: { isFetching: false, json: customJSON },
        localsource: { isFetching: false, json: localJSON }
      },
      selectedOdd: ''
    }, {
      type: 'UPDATE_DATATYPE_DOCS',
      member: 'teidata.enumerated',
      docEl: 'desc',
      content: 'new desc',
      index: 0
    })
    expect(state.odd.customization.json.datatypes.filter(
      x => (x.ident === 'teidata.enumerated')
    )[0].desc[0]).toEqual('new desc')
  })

  it('should handle DELETE_DATATYPE_DOCS (desc)', () => {
    customJSON = JSON.parse(customization)
    localJSON = JSON.parse(localsource)
    const state = romajsApp({
      odd: {
        customization: { isFetching: false, json: customJSON },
        localsource: { isFetching: false, json: localJSON }
      },
      selectedOdd: ''
    }, {
      type: 'DELETE_DATATYPE_DOCS',
      member: 'teidata.enumerated',
      docEl: 'desc',
      index: 0
    })
    expect(state.odd.customization.json.datatypes.filter(
      x => (x.ident === 'teidata.enumerated')
    )[0].desc[0]).toNotExist
  })

  it('should handle CREATE_NEW_DATATYPE', () => {
    customJSON = JSON.parse(customization)
    localJSON = JSON.parse(localsource)
    const state = romajsApp({
      odd: {
        customization: { isFetching: false, json: customJSON },
        localsource: { isFetching: false, json: localJSON }
      },
      selectedOdd: ''
    }, {
      type: 'CREATE_NEW_DATATYPE',
      name: 'teidata.new',
      module: 'tei'
    })
    expect(state.odd.customization.json.datatypes.filter(
      x => (x.ident === 'teidata.new')
    )[0]).toExist()
  })

  it('should handle DISCARD_DATATYPE_CHANGES', () => {
    customJSON = JSON.parse(customization)
    localJSON = JSON.parse(localsource)
    const firstState = romajsApp({
      odd: {
        customization: { isFetching: false, json: customJSON, orig: customJSON },
        localsource: { isFetching: false, json: localJSON }
      },
      selectedOdd: ''
    }, {
      type: 'UPDATE_DATATYPE_DOCS',
      member: 'teidata.enumerated',
      docEl: 'desc',
      content: 'new desc',
      index: 0
    })
    const state = romajsApp(firstState, {
      type: 'DISCARD_DATATYPE_CHANGES',
      name: 'teidata.enumerated'
    })
    expect(firstState.odd.customization.json.datatypes.filter(
      x => (x.ident === 'teidata.enumerated')
    )[0]._changed).toExist()
    expect(state.odd.customization.json.datatypes.filter(
      x => (x.ident === 'teidata.enumerated')
    )[0]._changed).toNotExist()
  })

  it('should handle REVERT_DATATYPE_TO_SOURCE', () => {
    customJSON = JSON.parse(customization)
    localJSON = JSON.parse(localsource)

    // Change JSON data
    customJSON.datatypes = customJSON.datatypes.map(dt => {
      if (dt.ident === 'teidata.enumerated') {
        dt.altIdent = ['teidata.numerato']
      }
      return dt
    })

    expect(customJSON.datatypes.filter(
      x => (x.ident === 'teidata.enumerated')
    )[0].altIdent[0]).toEqual('teidata.numerato')

    const state = romajsApp({
      odd: {
        customization: { isFetching: false, json: customJSON, orig: customJSON },
        localsource: { isFetching: false, json: localJSON }
      },
      selectedOdd: ''
    }, {
      type: 'REVERT_DATATYPE_TO_SOURCE',
      name: 'teidata.enumerated'
    })
    expect(state.odd.customization.json.datatypes.filter(
      x => (x.ident === 'teidata.enumerated')
    )[0].altIdent[0]).toNotExist()
  })

  it('should handle SET_DATAREF', () => {
    customJSON = JSON.parse(customization)
    localJSON = JSON.parse(localsource)
    const state = romajsApp({
      odd: {
        customization: { isFetching: false, json: customJSON },
        localsource: { isFetching: false, json: localJSON }
      },
      selectedOdd: ''
    }, {
      type: 'SET_DATAREF',
      datatype: 'teidata.enumerated',
      keyOrName: 'anyURI',
      index: 0
    })
    expect(state.odd.customization.json.datatypes.filter(
      x => (x.ident === 'teidata.enumerated')
    )[0].content[0].name).toEqual('anyURI')
  })

  it('should handle SET_DATAREF_RESTRICTION', () => {
    customJSON = JSON.parse(customization)
    localJSON = JSON.parse(localsource)
    const state = romajsApp({
      odd: {
        customization: { isFetching: false, json: customJSON },
        localsource: { isFetching: false, json: localJSON }
      },
      selectedOdd: ''
    }, {
      type: 'SET_DATAREF_RESTRICTION',
      datatype: 'teidata.enumerated',
      keyOrName: 'teidata.word',
      value: '[0-9]',
      index: 0
    })
    expect(state.odd.customization.json.datatypes.filter(
      x => (x.ident === 'teidata.enumerated')
    )[0].content[0].restriction).toEqual('[0-9]')
  })

  it('should handle NEW_DATAREF', () => {
    customJSON = JSON.parse(customization)
    localJSON = JSON.parse(localsource)
    const state = romajsApp({
      odd: {
        customization: { isFetching: false, json: customJSON },
        localsource: { isFetching: false, json: localJSON }
      },
      selectedOdd: ''
    }, {
      type: 'NEW_DATAREF',
      datatype: 'teidata.enumerated'
    })
    expect(state.odd.customization.json.datatypes.filter(
      x => (x.ident === 'teidata.enumerated')
    )[0].content[1].name).toEqual('string')
  })

  it('should handle NEW_TEXTNODE', () => {
    customJSON = JSON.parse(customization)
    localJSON = JSON.parse(localsource)
    const state = romajsApp({
      odd: {
        customization: { isFetching: false, json: customJSON },
        localsource: { isFetching: false, json: localJSON }
      },
      selectedOdd: ''
    }, {
      type: 'NEW_TEXTNODE',
      datatype: 'teidata.enumerated'
    })
    expect(state.odd.customization.json.datatypes.filter(
      x => (x.ident === 'teidata.enumerated')
    )[0].content[1].type).toEqual('textNode')
  })

  it('should handle NEW_DATATYPE_VALLIST', () => {
    customJSON = JSON.parse(customization)
    localJSON = JSON.parse(localsource)
    const state = romajsApp({
      odd: {
        customization: { isFetching: false, json: customJSON },
        localsource: { isFetching: false, json: localJSON }
      },
      selectedOdd: ''
    }, {
      type: 'NEW_DATATYPE_VALLIST',
      datatype: 'teidata.enumerated'
    })
    expect(state.odd.customization.json.datatypes.filter(
      x => (x.ident === 'teidata.enumerated')
    )[0].content[1].type).toEqual('valList')
  })

  it('should handle ADD_DATATYPE_VALITEM', () => {
    customJSON = JSON.parse(customization)
    localJSON = JSON.parse(localsource)
    const firstState = romajsApp({
      odd: {
        customization: { isFetching: false, json: customJSON },
        localsource: { isFetching: false, json: localJSON }
      },
      selectedOdd: ''
    }, {
      type: 'NEW_DATATYPE_VALLIST',
      datatype: 'teidata.enumerated'
    })
    const state = romajsApp(firstState, {
      type: 'ADD_DATATYPE_VALITEM',
      datatype: 'teidata.enumerated',
      index: 1,
      value: 'test'
    })
    expect(state.odd.customization.json.datatypes.filter(
      x => (x.ident === 'teidata.enumerated')
    )[0].content[1].valItem[0].ident).toEqual('test')
  })

  it('should handle DELETE_DATATYPE_VALITEM', () => {
    customJSON = JSON.parse(customization)
    localJSON = JSON.parse(localsource)
    const firstState = romajsApp({
      odd: {
        customization: { isFetching: false, json: customJSON },
        localsource: { isFetching: false, json: localJSON }
      },
      selectedOdd: ''
    }, {
      type: 'NEW_DATATYPE_VALLIST',
      datatype: 'teidata.enumerated'
    })
    const secondState = romajsApp(firstState, {
      type: 'ADD_DATATYPE_VALITEM',
      datatype: 'teidata.enumerated',
      index: 1,
      value: 'test'
    })
    const state = romajsApp(secondState, {
      type: 'DELETE_DATATYPE_VALITEM',
      datatype: 'teidata.enumerated',
      index: 1,
      value: 'test'
    })
    expect(state.odd.customization.json.datatypes.filter(
      x => (x.ident === 'teidata.enumerated')
    )[0].content[1].valItem[0]).toNotExist()
  })

  it('should handle DELETE_DATATYPE_CONTENT', () => {
    customJSON = JSON.parse(customization)
    localJSON = JSON.parse(localsource)
    const state = romajsApp({
      odd: {
        customization: { isFetching: false, json: customJSON },
        localsource: { isFetching: false, json: localJSON }
      },
      selectedOdd: ''
    }, {
      type: 'DELETE_DATATYPE_CONTENT',
      datatype: 'teidata.enumerated',
      index: 0
    })
    expect(state.odd.customization.json.datatypes.filter(
      x => (x.ident === 'teidata.enumerated')
    )[0].content[0]).toNotExist()
  })

  it('should handle MOVE_DATATYPE_CONTENT', () => {
    customJSON = JSON.parse(customization)
    localJSON = JSON.parse(localsource)
    const firstState = romajsApp({
      odd: {
        customization: { isFetching: false, json: customJSON },
        localsource: { isFetching: false, json: localJSON }
      },
      selectedOdd: ''
    }, {
      type: 'NEW_DATAREF',
      datatype: 'teidata.enumerated'
    })
    const state = romajsApp(firstState, {
      type: 'MOVE_DATATYPE_CONTENT',
      datatype: 'teidata.enumerated',
      indexFrom: 0,
      indexTo: 1
    })
    expect(state.odd.customization.json.datatypes.filter(
      x => (x.ident === 'teidata.enumerated')
    )[0].content[1].key).toEqual('teidata.word')
  })

  it('should handle SET_DATATYPE_CONTENT_GROUPING (to unordered)', () => {
    customJSON = JSON.parse(customization)
    localJSON = JSON.parse(localsource)
    const state = romajsApp({
      odd: {
        customization: { isFetching: false, json: customJSON },
        localsource: { isFetching: false, json: localJSON }
      },
      selectedOdd: ''
    }, {
      type: 'SET_DATATYPE_CONTENT_GROUPING',
      datatype: 'teidata.language',
      groupingType: 'unordered'
    })
    expect(state.odd.customization.json.datatypes.filter(
      x => (x.ident === 'teidata.language')
    )[0].content[0].type).toEqual('dataRef')
  })

  it('should handle SET_DATATYPE_CONTENT_GROUPING (alt to seq)', () => {
    customJSON = JSON.parse(customization)
    localJSON = JSON.parse(localsource)
    const state = romajsApp({
      odd: {
        customization: { isFetching: false, json: customJSON },
        localsource: { isFetching: false, json: localJSON }
      },
      selectedOdd: ''
    }, {
      type: 'SET_DATATYPE_CONTENT_GROUPING',
      datatype: 'teidata.language',
      groupingType: 'sequence'
    })
    expect(state.odd.customization.json.datatypes.filter(
      x => (x.ident === 'teidata.language')
    )[0].content[0].type).toEqual('sequence')
  })

  it('should handle SET_DATATYPE_CONTENT_GROUPING (unorderd to alt)', () => {
    customJSON = JSON.parse(customization)
    localJSON = JSON.parse(localsource)
    const state = romajsApp({
      odd: {
        customization: { isFetching: false, json: customJSON },
        localsource: { isFetching: false, json: localJSON }
      },
      selectedOdd: ''
    }, {
      type: 'SET_DATATYPE_CONTENT_GROUPING',
      datatype: 'teidata.enumerated',
      groupingType: 'alternate'
    })
    expect(state.odd.customization.json.datatypes.filter(
      x => (x.ident === 'teidata.language')
    )[0].content[0].type).toEqual('alternate')
  })
})
