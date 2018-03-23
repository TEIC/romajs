import { connect } from 'react-redux'
import Attribute from '../components/Attribute'
import { setNs, setUsage } from '../actions/attributes'

const mapStateToProps = (state, ownProps) => {
  const attribute = ownProps.member.attributes.filter(x => (x.ident === ownProps.attribute))[0]
  return {member: ownProps.member, attribute}
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setNs: (ns) => dispatch(setNs(ownProps.member.ident, 'element', ownProps.attribute, ns)),
    setUsage: (usage) => dispatch(setUsage(ownProps.member.ident, 'element', ownProps.attribute, usage))
  }
}

const EditAttribute = connect(
  mapStateToProps,
  mapDispatchToProps
)(Attribute)

export default EditAttribute
