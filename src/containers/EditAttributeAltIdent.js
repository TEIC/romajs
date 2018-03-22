import { connect } from 'react-redux'
import AltIdent from '../components/AltIdent'
import { updateAttributeDocs } from '../actions/attributes'

const mapStateToProps = (state, ownProps) => {
  const altIdent = ownProps.attribute.altIdent ? ownProps.attribute.altIdent : []
  return {ident: ownProps.attribute.ident, altIdent}
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    update: (member, content, index) => {
      dispatch(updateAttributeDocs(ownProps.member.ident, 'element', ownProps.attribute.ident, 'altIdent', content, index))
    },
    delete: (member, index) => {return [member, index]}
  }
}

const AltIdentContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AltIdent)

export default AltIdentContainer
