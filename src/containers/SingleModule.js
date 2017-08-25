import { connect } from 'react-redux'
import { includeModules, excludeModules } from '../actions/modules'
import Module from '../components/Module'

const mapStateToProps = (state, ownProps) => { return ownProps }

const mapDispatchToProps = (dispatch) => {
  return {
    toggleModule: (name, selected) => {
      if (selected) {
        dispatch(excludeModules([name]))
      } else {
        dispatch(includeModules([name]))
      }
    }
  }
}

const SingleModule = connect(
  mapStateToProps,
  mapDispatchToProps
)(Module)

export default SingleModule
