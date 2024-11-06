import { connect } from 'react-redux'
import Settings from '../components/Settings'
import { push } from 'react-router-redux'
import { setOddSetting, applySettings} from '../actions/settings'
import { setLoadingStatus } from '../actions/interface'
import { updateCustomizationOdd, compileWithTEIGarage, postToTEIGarage, fetchLocalSource } from '../actions'
import teigarage from '../utils/teigarage'
import datasource from '../utils/datasources'
import { _i18n } from '../localization/i18n'

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
    if (state.odd.customization.updatedXml && state.odd.customization.updatedFor === 'lang') {
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
    loadingStatus: state.ui.loadingStatus,
    language: state.ui.language
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    goToMemberPage: () => dispatch(push('/members')),
    setOddSetting: (key, value) => dispatch(setOddSetting(key, value)),
    applySettings: () => dispatch(applySettings()),
    chooseNewDocLang: (lang, uilang) => {
      const i18n = _i18n(uilang, 'SettingsPage')
      dispatch(setLoadingStatus(`${i18n('Obtaining new language documentation')} (${lang}).`))
      dispatch(updateCustomizationOdd('lang'))
      if (lang !== 'en') {
        dispatch(fetchLocalSource(`${datasource}/p5subset_${lang}.json`))
      } else {
        dispatch(fetchLocalSource(`${datasource}/p5subset.json`))
      }
    },
    getNewDocForLang: (data, lang) => {
      dispatch(compileWithTEIGarage(data, teigarage['compiled.odd'](lang))).then((compiledOdd) => {
        dispatch(postToTEIGarage(compiledOdd, teigarage.json(lang)))
      })
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Settings)
