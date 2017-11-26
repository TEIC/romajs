import expect from 'expect'
import fs from 'fs'
import romajsApp from './combinedReducers'

const customization = JSON.parse(fs.readFileSync('test/fakeData/bare.json', 'utf-8'))
const localsource = JSON.parse(fs.readFileSync('test/fakeData/p5subset.json', 'utf-8'))

describe('ODD elements operation reducers', () => {
  it('should handle UPDATE_ELEMENT_DOCS (desc)', () => {
    const state = romajsApp({
      odd: {
        customization: { isFetching: false, json: customization },
        localsource: { isFetching: false, json: localsource }
      },
      selectedOdd: ''
    }, {
      type: 'UPDATE_ELEMENT_DOCS',
      element: 'p',
      docEl: 'desc',
      content: 'new desc'
    })
    expect(state.odd.customization.json.members.filter(
      x => (x.ident === 'p')
    )[0].desc).toEqual('new desc')
  })
})
