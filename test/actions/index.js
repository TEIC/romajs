import fs from 'fs'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import expect from 'expect'
import express from 'express'
import { DOMParser } from 'xmldom'
import * as actions from '../../src/actions'

const middlewares = [ thunk ]
const mockStore = configureMockStore(middlewares)
fs

const startTestServer = () => {
  const app = new (express)()
  const port = 3000
  app.use('/fakeData', express.static('test/fakeData'))

  return app.listen(port, (error) => {
    if (error) {
      throw new Error(error)
    }
  })
}

describe('I/O ODD actions', () => {
  it('selectOdd should store the URL of an input ODD', () =>{
    expect(actions.selectOdd('./fakeData/bare.odd')).toEqual({
      type: 'SELECT_ODD',
      oddUrl: './fakeData/bare.odd'
    })
  })

  it('fetchLocalSource should retrieve a local source (P5subset.json)', (done) =>{
    const store = mockStore({ receivedOdd: {}, selectedOdd: '' })

    const srv = startTestServer()

    store.subscribe(() => {
      const receiveAct = store.getActions().find((act)=>{
        return act.type === 'RECEIVE_LOCAL_SOURCE'
      })
      if (receiveAct) {
        srv.close()
        expect(receiveAct.json.modules.length).toEqual(21)
        done()
      }
    })
    store.dispatch(actions.fetchLocalSource('http://localhost:3000/fakeData/p5subset.json'))
  })

  it('fetchOdd should retrieve an input ODD', (done) =>{
    const store = mockStore({ receivedOdd: {}, selectedOdd: './fakeData/bare.odd' })
    // spin up the server temporarily
    const srv = startTestServer()

    store.subscribe(() => {
      const receiveAct = store.getActions().find((act)=>{
        return act.type === 'RECEIVE_ODD'
      })
      if (receiveAct) {
        expect(new DOMParser().parseFromString(receiveAct.xml).getElementsByTagName('schemaSpec').length).toEqual(1)
        srv.close()
        done()
      }
    })
    store.dispatch(actions.fetchOdd('http://localhost:3000/fakeData/bare.odd'))
  })

  // Muted to avoid too many requests to oxGarage
  // it('postToOxGarage should obtain a compiled version of the ODD', (done) => {
  //   const store = mockStore({})
  //   const odd2json = 'http://www.tei-c.org/ege-webservice//Conversions/ODD%3Atext%3Axml/ODDC%3Atext%3Axml/oddjson%3Aapplication%3Ajson/'
  //   return fs.readFile('test/fakeData/bare.odd', 'utf-8', (err, data) => {
  //     if (err) {
  //       throw new Error('Unable to read file')
  //     }
  //
  //     store.subscribe(() => {
  //       const receiveAct = store.getActions().find((act)=>{
  //         return act.type === 'RECEIVE_FROM_OXGARAGE'
  //       })
  //       if (receiveAct) {
  //         expect(receiveAct.json.members.length).toBeGreaterThan(0)
  //         done()
  //       }
  //     })
  //     store.dispatch(actions.postToOxGarage(data, odd2json))
  //   })
  // }).timeout(30000) // giving a long time for slower connections
})
