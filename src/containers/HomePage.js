import { connect } from 'react-redux'
import { fetchOdd, receiveOdd, postToOxGarage, fetchLocalSource, receiveFromOxGarage, clearState } from '../actions'
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
      dispatch(push('/members'))
      dispatch(setLoadingStatus(i18n.step1[lang]))
      dispatch(fetchOdd(url)).then((odd) => {
        // 1. Get JSON via OxGarage
        dispatch(setLoadingStatus(i18n.step2[lang]))
        dispatch(postToOxGarage(odd.xml, oxgarage.compile_json)).then(() => {
          dispatch(setLoadingStatus(i18n.step3[lang]))
          // 2. Get p5subset.
          dispatch(fetchLocalSource(`${datasource}/p5subset.json`))
        })
      })
    },
    uploadCustomization: (files, lang) => {
      dispatch(clearState())
      dispatch(push('/members'))
      dispatch(setLoadingStatus(i18n.step1[lang]))
      const reader = new FileReader()
      reader.readAsText(files[0])
      reader.onload = (e) => {
        dispatch(receiveOdd(e.target.result))
        // 1. Get JSON via OxGarage
        dispatch(setLoadingStatus(i18n.step2[lang]))
        const odd = new DOMParser().parseFromString(e.target.result, 'text/xml')
        if (odd.getElementsByTagNameNS('http://www.tei-c.org/ns/1.0', 'TEI').length !== 1 ) {
          throw Error('This does not appear to be a TEI document.')
        }
        if (odd.getElementsByTagNameNS('http://relaxng.org/ns/structure/1.0', '*').length > 0) {
          throw Error('ODDs with RELAX NG elements are not supported.')
        }
        if (odd.getElementsByTagName('schemaSpec').length === 0) {
          throw Error('This does not appear to be a TEI ODD document.')
        }
        if (odd.querySelectorAll('*[source]').length > 0) {
          throw Error('RomaJS does not support TEI ODD with @source attributes at the moment.')
        }
        dispatch(postToOxGarage(e.target.result, oxgarage.compile_json)).then(() => {
          dispatch(setLoadingStatus(i18n.step3[lang]))
          // 2. Get p5subset.
          dispatch(fetchLocalSource(`${datasource}/p5subset.json`))
          // dispatch(fetchLocalSource('/fakeData/p5subset.json'))
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
