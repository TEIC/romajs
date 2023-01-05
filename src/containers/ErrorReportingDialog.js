import { connect } from 'react-redux'
import ErrorReporting from '../components/dialogs/ErrorReporting'
import { push } from 'react-router-redux'

const mapStateToProps = (state, ownProps) => {
  const stateErr = state.odd.error ? state.odd.error.message : ''
  const error = ownProps.error ? ownProps.error : stateErr
  const show = state.odd.error ? true : ownProps.show
  return {show, hide: ownProps.hide, error, language: state.ui.language}
}

const mapDispatchToProps = (dispatch) => {
  return {
    goHome: () => { dispatch(push('/')) }
  }
}

const ErrorReportingDialog = connect(
  mapStateToProps,
  mapDispatchToProps
)(ErrorReporting)

export default ErrorReportingDialog
