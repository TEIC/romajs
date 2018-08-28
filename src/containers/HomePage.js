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
        // 1. Compile ODD on the fly via OxGarage
        dispatch(setLoadingStatus('Compiling customization ODD...'))
        let fd = new FormData()
        fd.append('fileToConvert', new Blob([odd.xml], {'type': 'application\/octet-stream'}), 'file.odd')
        fetch(oxgarage.compile, {
          mode: 'cors',
          method: 'post',
          body: fd
        })
          .then(response => {return response.text()})
          .then((compiled) => {
            dispatch(setLoadingStatus('Importing customization ODD...'))
            // 2. Get JSON via action to save to state
            dispatch(postToOxGarage(compiled, oxgarage.json)).then(() => {
              dispatch(setLoadingStatus('Obtaining full specification source...'))
              // 3. Get p5subset. TODO: optimize this for speed.
              // from next release it should be possible to get p5susbet.json directly
              fetch('http://www.tei-c.org/Vault/P5/current/xml/tei/odd/p5subset.xml')
                .then(response => response.text())
                .then(p5data => {
                  dispatch(setLoadingStatus('Importing full specification source (last step!)...'))
                  // 4. Transform into JSON
                  fd = new FormData()
                  fd.append('fileToConvert', new Blob([p5data], {'type': 'application\/octet-stream'}), 'p5.odd')
                  fetch(oxgarage.json, {
                    mode: 'cors',
                    method: 'post',
                    body: fd
                  })
                    .then(response => {return response.json()})
                    .then(json => {
                      dispatch(receiveLocalSource(json))
                    })
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
        // 1. Compile ODD on the fly via OxGarage
        dispatch(setLoadingStatus('Compiling customization ODD...'))
        let fd = new FormData()
        fd.append('fileToConvert', new Blob([e.target.result], {'type': 'application\/octet-stream'}), 'file.odd')
        fetch(oxgarage.compile, {
          mode: 'cors',
          method: 'post',
          body: fd
        })
          .then(response => {return response.text()})
          .then((compiled) => {
            dispatch(setLoadingStatus('Importing customization ODD...'))
            // 2. Get JSON via action to save to state
            dispatch(postToOxGarage(compiled, oxgarage.json)).then(() => {
              dispatch(setLoadingStatus('Obtaining full specification source...'))
              // 3. Get p5subset. TODO: optimize this for speed.
              // from next release it should be possible to get p5susbet.json directly
              fetch('http://www.tei-c.org/Vault/P5/current/xml/tei/odd/p5subset.xml')
                .then(response => response.text())
                .then(p5data => {
                  dispatch(setLoadingStatus('Importing full specification source (last step!)...'))
                  // 4. Transform into JSON
                  fd = new FormData()
                  fd.append('fileToConvert', new Blob([p5data], {'type': 'application\/octet-stream'}), 'p5.odd')
                  fetch(oxgarage.json, {
                    mode: 'cors',
                    method: 'post',
                    body: fd
                  })
                    .then(response => {return response.json()})
                    .then(json => {
                      dispatch(receiveLocalSource(json))
                    })
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
