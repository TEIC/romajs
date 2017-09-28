import expect from 'expect'
import romajsApp from '../../src/reducers'

const initialState = { selectedOdd: '', odd: {}, ui: {} }

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
    const xml = '<TEI><teiHeader/><text><body><schemaSpec></schemaSpec></body></text></TEI>'
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

  it('should handle REQUEST_OXGARAGE_TRANSFORM', () => {
    const nextState = romajsApp(initialState, {
      type: 'REQUEST_OXGARAGE_TRANSFORM',
      input: '<TEI><teiHeader/><text><body><schemaSpec></schemaSpec></body></text></TEI>',
      endpoint: 'http://www.tei-c.org/ege-webservice//Conversions/ODD%3Atext%3Axml/ODDC%3Atext%3Axml/oddjson%3Aapplication%3Ajson/'
    })
    expect(nextState.odd.customization).toEqual({ isFetching: true })
  })

  it('should handle RECEIVE_FROM_OXGARAGE', () => {
    const json = {'title': 'The TEI Guidelines', 'edition': '', 'generator': 'odd2json',
      'modules': [{'ident': 'analysis', 'id': 'AI', 'desc': 'Simple analytic mechanisms'}]}
    const receivedAt = Date.now()
    const nextState = romajsApp(initialState, {
      type: 'RECEIVE_FROM_OXGARAGE',
      json,
      receivedAt
    })
    expect(nextState.odd.customization).toEqual({ isFetching: false, json: json, receivedAt: receivedAt})
  })
})
