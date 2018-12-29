import { connect } from 'react-redux'
import Desc from '../components/Desc'
import { deleteElementDocs, updateElementDocs } from '../actions/elements'
import { deleteClassDocs, updateClassDocs } from '../actions/classes'

const mapStateToProps = (state, ownProps) => {
  // TODO: parametrize language
  return {
    ident: ownProps.member.ident,
    desc: ownProps.member.desc,
    lang: 'en'}
}

const mapDispatchToProps = (dispatch, ownProps) => {
  switch (ownProps.memberType) {
    case 'element':
      return {
        update: (member, content, index) => {dispatch(updateElementDocs(member, 'desc', content, index))},
        delete: (member, index) => dispatch(deleteElementDocs(member, 'desc', index))
      }
    case 'class':
      return {
        update: (member, content, index) => {dispatch(updateClassDocs(member, 'desc', content, index))},
        delete: (member, index) => dispatch(deleteClassDocs(member, 'desc', index))
      }
    default:
      return {
        update: () => {},
        delete: () => {}
      }
  }
}

const DescContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Desc)

export default DescContainer
