import { connect } from 'react-redux'
import AltIdent from '../components/AltIdent'
import { updateAttributeDocs, deleteAttributeDocs } from '../actions/attributes'

const mapStateToProps = (state, ownProps) => {
  const altIdent = ownProps.attribute.altIdent ? ownProps.attribute.altIdent : []
  return {ident: ownProps.attribute.ident, altIdent}
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    update: (ident, content, index) => {
      dispatch(updateAttributeDocs(ownProps.member.ident, ownProps.memberType, ident, 'altIdent', content, index))
    },
    delete: (ident, index) => {
      dispatch(deleteAttributeDocs(ownProps.member.ident, ownProps.memberType, ident, 'altIdent', index))
    }
  }
}

const AltIdentContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AltIdent)

export default AltIdentContainer
