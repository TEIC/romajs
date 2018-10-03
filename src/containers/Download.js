import { connect } from 'react-redux'
import { updateCustomizationOdd, exportOdd, exportSchema } from '../actions'
import DownloadButton from '../components/DownloadButton'

const mapStateToProps = (state) => {
  return {
    language: state.ui.language
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    downloadCustomization: () => {
      dispatch(updateCustomizationOdd())
      // TODO: keep an eye on this;
      // you don't want it to fire before the customization update is completed.
      dispatch(exportOdd())
    },
    downloadRng: () => {
      console.log('rng')
      dispatch(updateCustomizationOdd())
      dispatch(exportSchema('rng'))
    },
    downloadW3c: () => {
      console.log('xml')
      dispatch(updateCustomizationOdd())
      dispatch(exportSchema('xml'))
    }
  }
}

const Download = connect(
  mapStateToProps,
  mapDispatchToProps
)(DownloadButton)

export default Download
