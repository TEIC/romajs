import { connect } from 'react-redux'
import { fetchOdd, receiveOdd, postToOxGarage, fetchLocalSource, fetchKnownCustomization,
  receiveOddJson, clearState } from '../actions'
import { clearUiData, setLoadingStatus } from '../actions/interface'
import { push } from 'react-router-redux'
import Home from '../components/Home'
import oxgarage from '../utils/oxgarage'
import fetch from 'isomorphic-fetch'
import datasource from '../utils/datasources'
import * as i18n from '../localization/HomePage'

const mapStateToProps = (state) => {
  return {
    language: state.ui.language
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getCustomization: (url, lang) => {
      dispatch(clearState())
      dispatch(push('/settings'))
      dispatch(setLoadingStatus(i18n.step1[lang]))
      dispatch(fetchOdd(url)).then(() => {
        // 1. This is a known customization, so get the JSON directly
        dispatch(setLoadingStatus(i18n.step2[lang]))
        dispatch(fetchKnownCustomization(url.replace(/(xml|odd)$/, 'json'))).then(() => {
          dispatch(setLoadingStatus(i18n.step3[lang]))
          // 2. Get p5subset.
          dispatch(fetchLocalSource(`${datasource}/p5subset.json`))
        })
      })
    },
    uploadCustomization: (files, lang) => {
      dispatch(clearState())
      dispatch(push('/settings'))
      dispatch(setLoadingStatus(i18n.step1[lang]))
      const reader = new FileReader()
      reader.readAsText(files[0])
      reader.onload = (e) => {
        dispatch(receiveOdd(e.target.result))
        // 1. Convert to JSON via OxGarage
        dispatch(setLoadingStatus(i18n.step2[lang]))
        dispatch(postToOxGarage(e.target.result, oxgarage.compile_json)).then(() => {
          dispatch(setLoadingStatus(i18n.step3[lang]))
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
