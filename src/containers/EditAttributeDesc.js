import { connect } from 'react-redux'
import Desc from '../components/Desc'
import { updateAttributeDocs } from '../actions/attributes'

const mapStateToProps = (state, ownProps) => {
  // TODO: parametrize language
  return {
    ident: ownProps.attribute.ident,
    desc: ownProps.attribute.desc,
    lang: 'en'}
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    update: (member, content, index) => {
      dispatch(updateAttributeDocs(ownProps.member.ident, 'element', ownProps.attribute.ident, 'desc', content, index))
    },
    delete: (element, index) => {return [element, index]}
  }
}

const EditElementDesc = connect(
  mapStateToProps,
  mapDispatchToProps
)(Desc)

export default EditElementDesc
