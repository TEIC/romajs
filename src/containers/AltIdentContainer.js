import { connect } from 'react-redux'
import AltIdent from '../components/AltIdent'
import { deleteElementDocs, updateElementDocs } from '../actions/elements'

const mapStateToProps = (state, ownProps) => {
  const element = state.odd.customization.json.elements.filter(x => x.ident === ownProps.element)[0]
  return {element: element.ident, altIdent: element.altIdent}
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateElementDocs: (element, content, index) => dispatch(updateElementDocs(element, 'altIdent', content, index)),
    deleteElementDocs: (element, index) => dispatch(deleteElementDocs(element, 'altIdent', index))
  }
}

const AltIdentContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AltIdent)

export default AltIdentContainer
