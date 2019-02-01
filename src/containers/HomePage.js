import { connect } from 'react-redux'
import { fetchOdd, receiveOdd, postToOxGarage, fetchLocalSource, receiveFromOxGarage, clearState } from '../actions'
import { clearUiData, setLoadingStatus } from '../actions/interface'
import { push } from 'react-router-redux'
import Home from '../components/Home'
import oxgarage from '../utils/oxgarage'
import fetch from 'isomorphic-fetch'

const mapStateToProps = (state) => {
  return {
    language: state.ui.language
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getCustomization: (url) => {
      dispatch(clearState())
      dispatch(push('/members'))
      dispatch(setLoadingStatus('1/3 Obtaining customization ODD...'))
      dispatch(fetchOdd(url)).then((odd) => {
        // 1. Get JSON via OxGarage
        dispatch(setLoadingStatus('2/3 Importing customization ODD...'))
        dispatch(postToOxGarage(odd.xml, oxgarage.compile_json)).then(() => {
          dispatch(setLoadingStatus('3/3 Importing full specification source...'))
          // 2. Get p5subset.
          // TODO: this is a terrible thing, but there are plans to fix it:
          // from next release it will be possible to get p5subset.json directly from the Vault.
          // dispatch(fetchLocalSource('http://mith.us/romajs/fakeData/p5subset.json'))
          // dispatch(fetchLocalSource('http://tei-c.org/Vault/P5/current/xml/tei/odd/p5subset.json'))
          dispatch(fetchLocalSource('/fakeData/p5subset.json'))
        })
      })
    },
    uploadCustomization: (files) => {
      dispatch(clearState())
      dispatch(push('/members'))
      dispatch(setLoadingStatus('1/3 Obtaining customization ODD...'))
      const reader = new FileReader()
      reader.readAsText(files[0])
      reader.onload = (e) => {
        dispatch(receiveOdd(e.target.result))
        // 1. Get JSON via OxGarage
        dispatch(setLoadingStatus('2/3 Importing customization ODD...'))
        const odd = new DOMParser().parseFromString(e.target.result, 'text/xml')
        if (odd.getElementsByTagNameNS('http://www.tei-c.org/ns/1.0', 'TEI').length !== 1 ) {
          throw Error('This does not appear to be a TEI document.')
        }
        if (odd.getElementsByTagNameNS('http://relaxng.org/ns/structure/1.0', '*').length > 0) {
          throw Error('ODDs with RELAX NG elements are not supported.')
        }
        dispatch(postToOxGarage(e.target.result, oxgarage.compile_json)).then(() => {
          dispatch(setLoadingStatus('3/3 Importing full specification source...'))
          // 2. Get p5subset.
          // TODO: this is a terrible thing, but there are plans to fix it:
          // from next release it will be possible to get p5susbet.json directly from the Vault.
          // dispatch(fetchLocalSource('http://mith.us/romajs/fakeData/p5subset.json'))
          dispatch(fetchLocalSource('/fakeData/p5subset.json'))
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
