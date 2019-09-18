import { connect } from 'react-redux'
import Settings from '../components/Settings'
import { push } from 'react-router-redux'
import { setOddSetting, applySettings} from '../actions/settings'
import { setLoadingStatus } from '../actions/interface'
import { updateCustomizationOdd, compileWithOxGarage, postToOxGarage, fetchLocalSource } from '../actions'
import oxgarage from '../utils/oxgarage'
import datasource from '../utils/datasources'

const mapStateToProps = (state) => {
  let settingsReady = false
  let isLoading = true
  let title = ''
  let filename = ''
  let namespace = ''
  let nsToAtts = false
  let prefix = ''
  let targetLang = ''
  let docLang = ''
  let author = ''
  let oddLastUpdated = 0
  let newDataForLanguage = ''
  if (state.odd.customization) {
    if (state.odd.customization.settings !== undefined) {
      settingsReady = true
      title = state.odd.customization.settings.title
      filename = state.odd.customization.settings.filename
      namespace = state.odd.customization.settings.namespace
      nsToAtts = state.odd.customization.settings.nsToAtts
      prefix = state.odd.customization.settings.prefix
      targetLang = state.odd.customization.settings.targetLang
      docLang = state.odd.customization.settings.docLang
      author = state.odd.customization.settings.author
    }
    if (state.odd.customization.lastUpdated) {
      oddLastUpdated = state.odd.customization.lastUpdated
    }
    if (state.odd.customization.updatedXml) {
      newDataForLanguage = state.odd.customization.updatedXml
    }
  }
  if (state.odd.customization && state.odd.localsource) {
    if (!state.odd.customization.isFetching && !state.odd.localsource.isFetching) {
      isLoading = false
    }
  }
  return {
    title,
    filename,
    namespace,
    nsToAtts,
    prefix,
    targetLang,
    docLang,
    author,
    isLoading,
    settingsReady,
    oddLastUpdated,
    newDataForLanguage,
    loadingStatus: state.ui.loadingStatus
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    goToMemberPage: () => dispatch(push('/members')),
    setOddSetting: (key, value) => dispatch(setOddSetting(key, value)),
    applySettings: () => dispatch(applySettings()),
    chooseNewDocLang: (lang) => {
      dispatch(setLoadingStatus(`Obtaining new language documentation (${lang}).`))
      dispatch(updateCustomizationOdd())
      if (lang !== 'en') {
        dispatch(fetchLocalSource(`${datasource}/p5subset_${lang}.json`))
      } else {
        dispatch(fetchLocalSource(`${datasource}/p5subset.json`))
      }
    },
    getNewDocForLang: (data, lang) => {
      dispatch(compileWithOxGarage(data, oxgarage['compile.odd'])).then((compiledOdd) => {
        dispatch(postToOxGarage(compiledOdd, oxgarage.json.replace('%3Een%3C', `%3E${lang}%3C`)))
      })
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Settings)
