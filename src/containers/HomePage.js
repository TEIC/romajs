import { connect } from 'react-redux'
import { fetchOdd, receiveOdd, postToOxGarage, fetchLocalSource,
  receiveOddJson, clearState } from '../actions'
import { clearUiData, setLoadingStatus } from '../actions/interface'
import { push } from 'react-router-redux'
import Home from '../components/Home'
import oxgarage from '../utils/oxgarage'
import fetch from 'isomorphic-fetch'
import datasource from '../utils/datasources'
import { i18n as _i18n } from '../localization/HomePage'

const mapStateToProps = (state) => {
  return {
    language: state.ui.language
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getCustomization: (url, lang) => {
      const i18n = _i18n(lang)
      dispatch(clearState())
      dispatch(push('/settings'))
      dispatch(setLoadingStatus(i18n('1/3 Obtaining customization ODD...')))
      dispatch(fetchOdd(url)).then((odd) => {
        // 1. Convert to JSON via OxGarage
        dispatch(setLoadingStatus(i18n('2/3 Importing customization ODD...')))
        dispatch(postToOxGarage(odd.xml, oxgarage.compile_json)).then(() => {
          dispatch(setLoadingStatus(i18n('3/3 Importing full specification source...')))
          // 2. Get p5subset.
          dispatch(fetchLocalSource(`${datasource}/p5subset.json`))
        })
      })
    },
    uploadCustomization: (files, lang) => {
      const i18n = _i18n(lang)
      dispatch(clearState())
      dispatch(push('/settings'))
      dispatch(setLoadingStatus(i18n('1/3 Obtaining customization ODD...')))
      const reader = new FileReader()
      reader.readAsText(files[0])
      reader.onload = (e) => {
        dispatch(receiveOdd(e.target.result))
        // 1. Convert to JSON via OxGarage
        dispatch(setLoadingStatus(i18n('2/3 Importing customization ODD...')))
        dispatch(postToOxGarage(e.target.result, oxgarage.compile_json)).then(() => {
          dispatch(setLoadingStatus(i18n('3/3 Importing full specification source...')))
          // 2. Get p5subset.
          dispatch(fetchLocalSource(`${datasource}/p5subset.json`))
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
            dispatch(receiveOddJson(JSON.parse(json)))
            dispatch(fetchLocalSource('fakeData/p5subset.json'))
            dispatch(push('/settings'))
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
