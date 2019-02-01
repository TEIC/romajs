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
})
