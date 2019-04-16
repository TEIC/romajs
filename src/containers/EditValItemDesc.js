import { connect } from 'react-redux'
import Desc from '../components/Desc'
import { updateAttributeDocs } from '../actions/attributes'
import { setValid } from '../actions/interface'

const mapStateToProps = (state, ownProps) => {
  // Special case for valDesc, which acts just like desc, but has a different name
  const desc = ownProps.attribute.valList.valItem.filter(vi => vi.ident === ownProps.valItem)[0].desc
  return {
    ident: ownProps.valItem,
    desc,
    docLang: state.odd.customization.settings.docLang || 'en',
    valItem: ownProps.valItem}
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    update: (member, content, index, valItem) => {
      dispatch(updateAttributeDocs(ownProps.member.ident, ownProps.memberType, ownProps.attribute.ident, 'desc', content, index, valItem))
    },
    delete: () => { },
    setValid: (valid) => dispatch(setValid(valid))
  }
}

const EditElementDesc = connect(
  mapStateToProps,
  mapDispatchToProps
)(Desc)

export default EditElementDesc
