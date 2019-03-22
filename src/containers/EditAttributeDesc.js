import { connect } from 'react-redux'
import Desc from '../components/Desc'
import { updateAttributeDocs, deleteAttributeDocs } from '../actions/attributes'

const mapStateToProps = (state, ownProps) => {
  // Special case for valDesc, which acts just like desc, but has a different name
  let desc = ownProps.attribute.desc
  if (ownProps.valDesc) {
    desc = ownProps.attribute.valDesc
  }
  return {
    ident: ownProps.attribute.ident,
    valDesc: ownProps.valDesc,
    desc,
    docLang: state.odd.customization.settings.docLang || 'en'}
}

const mapDispatchToProps = (dispatch, ownProps) => {
  const tagName = ownProps.valDesc ? 'valDesc' : 'desc'
  return {
    update: (member, content, index) => {
      dispatch(updateAttributeDocs(ownProps.member.ident, ownProps.memberType, ownProps.attribute.ident, tagName, content, index))
    },
    delete: (index) => {
      dispatch(deleteAttributeDocs(ownProps.member.ident, ownProps.memberType, ownProps.attribute.ident, tagName, index))
    }
  }
}

const EditElementDesc = connect(
  mapStateToProps,
  mapDispatchToProps
)(Desc)

export default EditElementDesc
