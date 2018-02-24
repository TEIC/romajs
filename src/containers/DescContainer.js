import { connect } from 'react-redux'
import Desc from '../components/Desc'
import { deleteElementDocs, updateElementDocs } from '../actions/elements'

const mapStateToProps = (state, ownProps) => {
  const element = state.odd.customization.json.elements.filter(x => x.ident === ownProps.element)[0]
  return {element: element.ident, desc: element.desc}
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateElementDocs: (element, content, index) => dispatch(updateElementDocs(element, 'desc', content, index)),
    deleteElementDocs: (element, index) => dispatch(deleteElementDocs(element, 'desc', index))
  }
}

const DescContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Desc)

export default DescContainer
