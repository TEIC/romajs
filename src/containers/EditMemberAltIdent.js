import { connect } from 'react-redux'
import AltIdent from '../components/AltIdent'
import { deleteElementDocs, updateElementDocs } from '../actions/elements'
import { deleteClassDocs, updateClassDocs } from '../actions/classes'
import { deleteDatatypeDocs, updateDatatypeDocs } from '../actions/datatypes'

const mapStateToProps = (state, ownProps) => {
  return {ident: ownProps.member.ident, altIdent: ownProps.member.altIdent || []}
}

const mapDispatchToProps = (dispatch, ownProps) => {
  switch (ownProps.memberType) {
    case 'element':
      return {
        update: (member, content, index) => {dispatch(updateElementDocs(member, 'altIdent', content, index))},
        delete: (member, index) => dispatch(deleteElementDocs(member, 'altIdent', index))
      }
    case 'class':
      return {
        update: (member, content, index) => {dispatch(updateClassDocs(member, 'altIdent', content, index))},
        delete: (member, index) => dispatch(deleteClassDocs(member, 'altIdent', index))
      }
    case 'datatype':
      return {
        update: (member, content, index) => {dispatch(updateDatatypeDocs(member, 'altIdent', content, index))},
        delete: (member, index) => dispatch(deleteDatatypeDocs(member, 'altIdent', index))
      }
    default:
      return {
        update: () => {},
        delete: () => {}
      }
  }
}

const EditElementAltIdent = connect(
  mapStateToProps,
  mapDispatchToProps
)(AltIdent)

export default EditElementAltIdent
