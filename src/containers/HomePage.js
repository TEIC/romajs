import { connect } from 'react-redux'
import { fetchOdd, receiveOdd, postToOxGarage, fetchLocalSource, receiveFromOxGarage } from '../actions'
import { clearUiData } from '../actions/interface'
import { push } from 'react-router-redux'
import Home from '../components/Home'
import oxgarage from '../utils/oxgarage'
// Test while OxGarage doesn't support XLST3:
import fetch from 'isomorphic-fetch'

const mapStateToProps = () => { return {} }

const mapDispatchToProps = (dispatch) => {
  return {
    getCustomization: (url) => {
      dispatch(fetchOdd(url)).then((odd) => {
        dispatch(postToOxGarage(odd.xml, oxgarage.json))
        dispatch(fetchLocalSource('fakeData/p5subset.json'))
        dispatch(push('/members'))
      })
    },
    uploadCustomization: (files) => {
      const reader = new FileReader()
      reader.readAsText(files[0])
      reader.onload = (e) => {
        dispatch(receiveOdd(e.target.result))
        dispatch(postToOxGarage(e.target.result, oxgarage.json))
        dispatch(fetchLocalSource('fakeData/p5subset.json'))
        dispatch(push('/members'))
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
