import { connect } from 'react-redux'
import AnchoredPicker from '../components/pickers/AnchoredPicker'
import { setDatatype } from '../actions/attributes'
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
  return {
    add: (type, item) => {
      dispatch(setDatatype(ownProps.member, 'element', ownProps.attribute, item.ident))
    }
  }
}

const DatatypePicker = connect(
  mapStateToProps,
  mapDispatchToProps
)(AnchoredPicker)

export default DatatypePicker
