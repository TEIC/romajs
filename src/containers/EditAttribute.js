import { connect } from 'react-redux'
import Attribute from '../components/Attribute'
import { setNs, setUsage, setValListType, addValItem, deleteValItem, setDataTypeRestriction} from '../actions/attributes'
import { clone } from '../utils/clone'
import { push } from 'react-router-redux'

const mapStateToProps = (state, ownProps) => {
  const attribute = clone(ownProps.member.attributes.filter(x => (x.ident === ownProps.attribute))[0])
  const success = attribute ? true : false
  // flag datatypes that don't exist
  if (attribute) {
    const dr = attribute.datatype.dataRef || {}
    if (dr.key) {
      if (state.odd.customization.json.datatypes.filter(dt => dt.ident === dr.key).length === 0) {
        dr._deleted = true
      }
    } else if (!dr.name) {
      // If no datatype is provided, add a generic datatype 'string'
      attribute.datatype.dataRef = {name: 'string'}
    }
  }
  return {member: ownProps.member, attribute, success, path: state.router.location.pathname,
    memberType: ownProps.memberType, setRouteLeaveHook: state.router.setRouteLeaveHook, language: state.ui.language}
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    navigateTo: (place) => dispatch(push(place)),
    setNs: (ns) => dispatch(setNs(ownProps.member.ident, ownProps.memberType, ownProps.attribute, ns)),
    setUsage: (usage) => dispatch(setUsage(ownProps.member.ident, ownProps.memberType, ownProps.attribute, usage)),
    setValListType: (type) => dispatch(setValListType(ownProps.member.ident, ownProps.memberType, ownProps.attribute, type)),
    addValItem: (value) => dispatch(addValItem(ownProps.member.ident, ownProps.memberType, ownProps.attribute, value)),
    deleteValItem: (value) => dispatch(deleteValItem(ownProps.member.ident, ownProps.memberType, ownProps.attribute, value)),
    setDataTypeRestriction: (value) => dispatch(setDataTypeRestriction(ownProps.member.ident, ownProps.memberType, ownProps.attribute, value))
  }
}

const EditAttribute = connect(
  mapStateToProps,
  mapDispatchToProps
)(Attribute)

export default EditAttribute
