import expect from 'expect'
import romajsApp from './combinedReducers'

const initialState = { selectedOdd: '', odd: {}, ui: { language: 'en', isOddValid: true } }

describe('Input ODD reducers', () => {
  it('should handle initial state', () => {
    expect(
      romajsApp(undefined, {})
    ).toEqual(initialState)
  })

  it('should handle SELECT_ODD', () => {
    const nextState = romajsApp({}, {
      type: 'SELECT_ODD',
      oddUrl: './fakeData/bare.odd'
    })
    expect(nextState.selectedOdd).toEqual('./fakeData/bare.odd')
  })

  it('should handle REQUEST_ODD', () => {
    const state = Object.assign({}, initialState,
      {selectedOdd: './fakeData/bare.odd'}
    )
    const nextState = romajsApp(state, {
      type: 'REQUEST_ODD',
      odd: './fakeData/bare.odd'
    })
    expect(nextState.odd.customization).toEqual({ isFetching: true })
    expect(nextState.selectedOdd).toEqual('./fakeData/bare.odd')
  })

  it('should handle RECEIVE_ODD', () => {
    const xml = '<TEI xmlns="http://www.tei-c.org/ns/1.0"><teiHeader/><text><body><schemaSpec></schemaSpec></body></text></TEI>'
    const newState = Object.assign({}, initialState,
      { selectedOdd: './fakeData/bare.odd',
        odd: {customization: { isFetching: true }, localsource: {} } }
    )
    const state = romajsApp(newState, {
      type: 'RECEIVE_ODD',
      xml: xml
    })

    expect(state.odd.customization.xml).toEqual(xml)
  })

  it('should handle REQUEST_LOCAL_SOURCE', () => {
    const nextState = romajsApp(initialState, {
      type: 'REQUEST_LOCAL_SOURCE',
      url: 'http://localhost:3000/fakeData/p5subset.json'
    })
    expect(nextState.odd.localsource).toEqual({ isFetching: true })
  })

  it('should handle RECEIVE_LOCAL_SOURCE', () => {
    const json = {'title': 'The TEI Guidelines', 'edition': '', 'generator': 'odd2json',
      'modules': [{'ident': 'analysis', 'id': 'AI', 'desc': 'Simple analytic mechanisms'}]}
    const state = romajsApp({
      odd: {customization: { isFetching: true }, localsource: {}},
      selectedOdd: './fakeData/bare.odd'
    }, {
      type: 'RECEIVE_LOCAL_SOURCE',
      json
    })
    expect(state.odd.localsource.json).toIncludeKey('modules')
  })

  it('should handle REQUEST_ODD_JSON', () => {
    const nextState = romajsApp(initialState, {
      type: 'REQUEST_ODD_JSON'
    })
    expect(nextState.odd.customization).toEqual({ isFetching: true })
  })

  it('should handle RECEIVE_ODD_JSON', () => {
    const json = {'title': 'The TEI Guidelines', 'edition': '', 'generator': 'odd2json',
      'modules': [{'ident': 'analysis', 'id': 'AI', 'desc': 'Simple analytic mechanisms'}]}
    const receivedAt = Date.now()
    const nextState = romajsApp(initialState, {
      type: 'RECEIVE_ODD_JSON',
      json,
      orig: json,
      receivedAt
    })
    expect(nextState.odd.customization).toEqual({ isFetching: false, json: json, orig: json, receivedAt: receivedAt})
  })
})
