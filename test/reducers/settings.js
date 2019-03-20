import expect from 'expect'
import fs from 'fs'
import romajsApp from './combinedReducers'

const customization = fs.readFileSync('test/fakeData/bare.json', 'utf-8')
const localsource = fs.readFileSync('test/fakeData/p5subset.json', 'utf-8')
let customJSON = null
let localJSON = null

describe('ODD settings operation reducers', () => {
  it('should handle SET_ODD_SETTING', () => {
    customJSON = JSON.parse(customization)
    localJSON = JSON.parse(localsource)
    const state = romajsApp({
      odd: {
        customization: { isFetching: false, json: customJSON },
        localsource: { isFetching: false, json: localJSON }
      },
      selectedOdd: ''
    }, {
      type: 'SET_ODD_SETTING',
      key: 'title',
      value: 'a title'
    })

    expect(state.odd.customization.settings.title).toEqual('a title')
  })

  it('should handle APPLY_ODD_SETTINGS', () => {
    customJSON = JSON.parse(customization)
    localJSON = JSON.parse(localsource)
    const firstState = romajsApp({
      odd: {
        customization: { isFetching: false, json: customJSON },
        localsource: { isFetching: false, json: localJSON }
      },
      selectedOdd: ''
    }, {
      type: 'SET_ODD_SETTING',
      key: 'title',
      value: 'a title'
    })

    const state = romajsApp(firstState, {
      type: 'APPLY_ODD_SETTINGS'
    })

    expect(state.odd.customization.json.title).toEqual('a title')
  })
})
