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
      content: ['new desc']
    })
    expect(state.odd.customization.json.members.filter(
      x => (x.ident === 'sourceDesc')
    )[0].desc[0]).toEqual('new desc')
  })
})
