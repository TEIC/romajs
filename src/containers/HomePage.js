import { connect } from 'react-redux'
import { fetchOdd, receiveOdd, postToOxGarage, fetchLocalSource, receiveLocalSource, receiveFromOxGarage, clearState } from '../actions'
import { clearUiData, setLoadingStatus } from '../actions/interface'
import { push } from 'react-router-redux'
import Home from '../components/Home'
import oxgarage from '../utils/oxgarage'
import fetch from 'isomorphic-fetch'

const mapStateToProps = () => { return {} }

const mapDispatchToProps = (dispatch) => {
  return {
    getCustomization: (url) => {
      dispatch(clearState())
      dispatch(push('/members'))
      dispatch(setLoadingStatus('Obtaining customization ODD...'))
      dispatch(fetchOdd(url)).then((odd) => {
        // 1. Get JSON via OxGarage
        dispatch(setLoadingStatus('Importing customization ODD...'))
        dispatch(postToOxGarage(odd.xml, oxgarage.compile_json)).then(() => {
          dispatch(setLoadingStatus('Obtaining full specification source...'))
          // 2. Get p5subset. TODO: optimize this for speed.
          // from next release it should be possible to get p5susbet.json directly
          fetch('http://www.tei-c.org/Vault/P5/current/xml/tei/odd/p5subset.xml')
            .then(response => response.text())
            .then(p5data => {
              dispatch(setLoadingStatus('Importing full specification source (last step!)...'))
              // 3. Transform into JSON
              const fd = new FormData()
              fd.append('fileToConvert', new Blob([p5data], {'type': 'application\/octet-stream'}), 'p5.odd')
              fetch(oxgarage.json, {
                mode: 'cors',
                method: 'post',
                body: fd
              })
                .then(response => {
                  if (!response.ok) {
                    throw Error(response.statusText)
                  }
                  return response.json()
                })
                .then(json => {
                  dispatch(receiveLocalSource(json))
                })
            })
        })
      })
    },
    uploadCustomization: (files) => {
      dispatch(clearState())
      dispatch(push('/members'))
      dispatch(setLoadingStatus('Obtaining customization ODD...'))
      const reader = new FileReader()
      reader.readAsText(files[0])
      reader.onload = (e) => {
        dispatch(receiveOdd(e.target.result))
        // 1. Get JSON via OxGarage
        dispatch(setLoadingStatus('Importing customization ODD...'))
        const odd = new DOMParser().parseFromString(e.target.result, 'text/xml')
        if (odd.getElementsByTagNameNS('http://relaxng.org/ns/structure/1.0', '*').length > 0) {
          throw Error('ODDs with RELAX NG elements are not supported.')
        }
        dispatch(postToOxGarage(e.target.result, oxgarage.compile_json)).then(() => {
          dispatch(setLoadingStatus('Obtaining full specification source...'))
          // 2. Get p5subset. TODO: optimize this for speed.
          // from next release it should be possible to get p5susbet.json directly
          fetch('http://www.tei-c.org/Vault/P5/current/xml/tei/odd/p5subset.xml')
            .then(response => {
              if (!response.ok) {
                throw Error(response.statusText)
              }
              return response.text()
            })
            .then(p5data => {
              dispatch(setLoadingStatus('Importing full specification source...'))
              // 3. Transform into JSON
              const fd = new FormData()
              fd.append('fileToConvert', new Blob([p5data], {'type': 'application\/octet-stream'}), 'p5.odd')
              fetch(oxgarage.json, {
                mode: 'cors',
                method: 'post',
                body: fd
              })
                .then(response => {
                  if (!response.ok) {
                    throw Error(response.statusText)
                  }
                  return response.json()
                })
                .then(json => {
                  dispatch(receiveLocalSource(json))
                })
            })
        })
      }
    },
    clearUiData: () => {
      dispatch(clearUiData())
    },
    loadTestData: () => {
      dispatch(fetchOdd('fakeData/bare.odd')).then(() => {
        fetch('fakeData/bare.json')
          .then(response => response.text())
          .then((json) => {
            dispatch(receiveFromOxGarage(JSON.parse(json)))
            dispatch(fetchLocalSource('fakeData/p5subset.json'))
            dispatch(push('/members'))
          })
      })
    }
  }
}

const HomePage = connect(
  mapStateToProps,
  mapDispatchToProps
)(Home)

export default HomePage
