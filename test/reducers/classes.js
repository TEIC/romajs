import expect from 'expect'
import fs from 'fs'
import romajsApp from './combinedReducers'

const customization = fs.readFileSync('test/fakeData/bare.json', 'utf-8')
const localsource = fs.readFileSync('test/fakeData/p5subset.json', 'utf-8')
let customJSON = null
let localJSON = null

describe('ODD elements operation reducers', () => {
  it('should handle UPDATE_CLASS_DOCS (desc)', () => {
    customJSON = JSON.parse(customization)
    localJSON = JSON.parse(localsource)
    const state = romajsApp({
      odd: {
        customization: { isFetching: false, json: customJSON },
        localsource: { isFetching: false, json: localJSON }
      },
      selectedOdd: ''
    }, {
      type: 'UPDATE_CLASS_DOCS',
      member: 'att.global',
      docEl: 'desc',
      content: 'new desc',
      index: 0
    })
    const allClasses = state.odd.customization.json.classes.attributes
      .concat(state.odd.customization.json.classes.models)
    expect(allClasses.filter(
      x => (x.ident === 'att.global')
    )[0].desc[0]).toEqual('new desc')
  })

  it('should handle DELETE_CLASS_DOCS (altIdent)', () => {
    customJSON = JSON.parse(customization)
    localJSON = JSON.parse(localsource)
    const state = romajsApp({
      odd: {
        customization: { isFetching: false, json: customJSON },
        localsource: { isFetching: false, json: localJSON }
      },
      selectedOdd: ''
    }, {
      type: 'DELETE_CLASS_DOCS',
      member: 'att.global',
      docEl: 'altIdent',
      index: 0
    })
    const allClasses = state.odd.customization.json.classes.attributes
      .concat(state.odd.customization.json.classes.models)
    expect(allClasses.filter(
      x => (x.ident === 'att.global')
    )[0].altIdent[0]).toNotExist
  })
})
