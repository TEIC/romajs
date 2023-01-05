import { connect } from 'react-redux'
import Datatype from '../components/Datatype'
import { push } from 'react-router-redux'
import { discardChanges, revertToSource, setDataRefRestriction, newDataRef, newTextNode,
  deleteDatatypeContent, moveDatatypeContent, newDatatypeValList, addDatatypeValItem,
  deleteDatatypeValItem, setDatatypeContentGrouping } from '../actions/datatypes'

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
  return {datatype, success, section: ownProps.match.params.section, language: state.ui.language}
}

const mapDispatchToProps = (dispatch) => {
  return {
    navigateTo: (place) => dispatch(push(place)),
    discardChanges: (dt) => dispatch(discardChanges(dt)),
    revertToSource: (dt) => dispatch(revertToSource(dt)),
    setDataRefRestriction: (dt, keyOrName, value, index) => dispatch(setDataRefRestriction(dt, keyOrName, value, index)),
    newDataRef: (dt) => dispatch(newDataRef(dt)),
    newTextNode: (dt) => dispatch(newTextNode(dt)),
    deleteDatatypeContent: (dt, index) => dispatch(deleteDatatypeContent(dt, index)),
    moveDatatypeContent: (dt, indexFrom, indexTo) => dispatch(moveDatatypeContent(dt, indexFrom, indexTo)),
    newDatatypeValList: (dt) => dispatch(newDatatypeValList(dt)),
    addDatatypeValItem: (dt, index, value) => dispatch(addDatatypeValItem(dt, index, value)),
    deleteDatatypeValItem: (dt, index, value) => dispatch(deleteDatatypeValItem(dt, index, value)),
    setDatatypeContentGrouping: (dt, groupingType) => dispatch(setDatatypeContentGrouping(dt, groupingType))
  }
}

const DatatypePage = connect(
  mapStateToProps,
  mapDispatchToProps
)(Datatype)

export default DatatypePage
