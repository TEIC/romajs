import { connect } from 'react-redux'
import AltIdent from '../components/AltIdent'
import { deleteElementDocs, updateElementDocs } from '../actions/elements'

const mapStateToProps = (state, ownProps) => {
  return {ident: ownProps.member.ident, altIdent: ownProps.member.altIdent}
}

const mapDispatchToProps = (dispatch) => {
  return {
    update: (element, content, index) => {dispatch(updateElementDocs(element, 'altIdent', content, index))},
    delete: (element, index) => dispatch(deleteElementDocs(element, 'altIdent', index))
  }
}

const EditElementAltIdent = connect(
  mapStateToProps,
  mapDispatchToProps
)(AltIdent)

export default EditElementAltIdent
