import { connect } from 'react-redux'
import Attribute from '../components/Attribute'
import { setNs, setUsage, setValListType, addValItem, deleteValItem, setDataTypeRestriction} from '../actions/attributes'

const mapStateToProps = (state, ownProps) => {
  const attribute = ownProps.member.attributes.filter(x => (x.ident === ownProps.attribute))[0]
  return {member: ownProps.member, attribute, path: state.router.location.pathname,
    setRouteLeaveHook: state.router.setRouteLeaveHook}
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setNs: (ns) => dispatch(setNs(ownProps.member.ident, 'element', ownProps.attribute, ns)),
    setUsage: (usage) => dispatch(setUsage(ownProps.member.ident, 'element', ownProps.attribute, usage)),
    setValListType: (type) => dispatch(setValListType(ownProps.member.ident, 'element', ownProps.attribute, type)),
    addValItem: (value) => dispatch(addValItem(ownProps.member.ident, 'element', ownProps.attribute, value)),
    deleteValItem: (value) => dispatch(deleteValItem(ownProps.member.ident, 'element', ownProps.attribute, value)),
    setDataTypeRestriction: (value) => dispatch(setDataTypeRestriction(ownProps.member.ident, 'element', ownProps.attribute, value))
  }
}

const EditAttribute = connect(
  mapStateToProps,
  mapDispatchToProps
)(Attribute)

export default EditAttribute
