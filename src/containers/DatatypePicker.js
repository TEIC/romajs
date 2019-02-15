import { connect } from 'react-redux'
import AnchoredPicker from '../components/pickers/AnchoredPicker'
import { setDatatype } from '../actions/attributes'
import { setDataRef } from '../actions/datatypes'
import primitiveDatatypes from '../utils/primitiveDatatypes'

const mapStateToProps = (state) => {
  const customDtypes = state.odd.customization.json.datatypes
  const allDtypes = customDtypes.concat(primitiveDatatypes)
  allDtypes.sort((a, b) => {
    const nameA = a.ident.toLowerCase()
    const nameB = b.ident.toLowerCase()
    if (nameA < nameB) return -1
    if (nameA > nameB) return 1
    return 0
  })
  return {items: allDtypes, pickerType: 'datatypes', icon: 'mode_edit',
    message: `Not seeing a datatype you're looking for? <a href='#'>Manage datatypes</a>`}
}

const mapDispatchToProps = (dispatch, ownProps) => {
  let set = (item) => setDatatype(ownProps.member, ownProps.memberType, ownProps.attribute, item.ident)

  if (!ownProps.attribute) {
    set = (item) => setDataRef(ownProps.member, item.ident, ownProps.index)
  }
  return {
    add: (type, item) => {
      dispatch(set(item))
    }
  }
}

const DatatypePicker = connect(
  mapStateToProps,
  mapDispatchToProps
)(AnchoredPicker)

export default DatatypePicker
