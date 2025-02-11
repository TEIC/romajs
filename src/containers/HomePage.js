import { connect } from 'react-redux'
import { fetchOdd, receiveOdd, postToTEIGarage, fetchLocalSource, fetchCustomLocalSource,
  receiveOddJson, clearState } from '../actions'
import { clearUiData, setLoadingStatus } from '../actions/interface'
import { push } from 'react-router-redux'
import Home from '../components/Home'
import teigarage from '../utils/teigarage'
import datasource from '../utils/datasources'
import { _i18n } from '../localization/i18n'

const mapStateToProps = (state) => {
  return {
    language: state.ui.language
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getCustomization: (url, lang, localsourceUrl) => {
      const i18n = _i18n(lang, 'HomePage')
      dispatch(clearState())
      dispatch(push('/settings'))
      dispatch(setLoadingStatus(i18n('1/3 Obtaining customization ODD...')))
      dispatch(fetchOdd(url)).then((odd) => {
        // 1. Convert to JSON via TEIGarage
        dispatch(setLoadingStatus(i18n('2/3 Importing customization ODD...')))
        dispatch(postToTEIGarage(odd.xml, teigarage.compile_json(lang))).then(() => {
          dispatch(setLoadingStatus(i18n('3/3 Importing full specification source...')))
          // 2. Get p5subset.
          if (localsourceUrl) {
            dispatch(fetchCustomLocalSource(localsourceUrl, teigarage.json()))
          } else {
            dispatch(fetchLocalSource(`${datasource}/p5subset.json`))
          }
        })
      })
    },
    uploadCustomization: (files, lang, localsourceUrl) => {
      const i18n = _i18n(lang, 'HomePage')
      dispatch(clearState())
      dispatch(push('/settings'))
      dispatch(setLoadingStatus(i18n('1/3 Obtaining customization ODD...')))
      const reader = new FileReader()
      reader.readAsText(files[0])
      reader.onload = (e) => {
        dispatch(receiveOdd(e.target.result, lang))
        // 1. Convert to JSON via TEIGarage
        dispatch(setLoadingStatus(i18n('2/3 Importing customization ODD...')))
        dispatch(postToTEIGarage(e.target.result, teigarage.compile_json(lang))).then(() => {
          dispatch(setLoadingStatus(i18n('3/3 Importing full specification source...')))
          // 2. Get p5subset or other localsource
          if (localsourceUrl) {
            dispatch(fetchCustomLocalSource(localsourceUrl, teigarage.json()))
          } else {
            dispatch(fetchLocalSource(`${datasource}/p5subset.json`))
          }
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
