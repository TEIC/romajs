import { connect } from 'react-redux'
import Datatype from '../components/Datatype'
import { push } from 'react-router-redux'
import { discardChanges, revertToSource } from '../actions/datatypes'

const mapStateToProps = (state, ownProps) => {
  let datatype = {}
  let success = false
  if (state.odd.customization && state.odd.localsource) {
    if (!state.odd.customization.isFetching && !state.odd.localsource.isFetching) {
      const customDts = state.odd.customization.json.datatypes
      // const localDts = state.odd.localsource.json.datatypes

      const customDt = customDts.filter(x => {
        return (x.ident === ownProps.match.params.cl)
      })[0]
      if (customDt) {
        datatype = customDt
        success = true
      }
    }
  }
  return {datatype, success, section: ownProps.match.params.section}
}

const mapDispatchToProps = (dispatch) => {
  return {
    navigateTo: (place) => dispatch(push(place)),
    discardChanges: (dt) => dispatch(discardChanges(dt)),
    revertToSource: (dt) => dispatch(revertToSource(dt))
  }
}

const DatatypePage = connect(
  mapStateToProps,
  mapDispatchToProps
)(Datatype)

export default DatatypePage
