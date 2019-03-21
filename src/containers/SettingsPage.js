import { connect } from 'react-redux'
import Settings from '../components/Settings'
import { push } from 'react-router-redux'
import { setOddSetting, applySettings} from '../actions/settings'

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
  }
  if (state.odd.customization && state.odd.localsource) {
    if (state.odd.customization.json !== undefined && state.odd.localsource.json !== undefined) {
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
    loadingStatus: state.ui.loadingStatus
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    goToMemberPage: () => dispatch(push('/members')),
    setOddSetting: (key, value) => dispatch(setOddSetting(key, value)),
    applySettings: () => dispatch(applySettings())
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Settings)
