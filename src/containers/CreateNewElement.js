import { connect } from 'react-redux'
import NewElement from '../components/dialogs/NewElement'
import { createNewElement } from '../actions/elements'
import { push } from 'react-router-redux'

const mapStateToProps = (state) => {
  const allElementIdents = new Set(state.odd.localsource.json.elements.map(el => el.ident))
  for (const el of state.odd.customization.json.elements) {
    allElementIdents.add(el.ident)
  }
  return { modules: state.odd.customization.json.modules, allElementIdents: Array.from(allElementIdents) }
}

const mapDispatchToProps = (dispatch) => {
  return {
    createNewElement: (name, module, ns) => {
      dispatch(createNewElement(name, module, ns))
    },
    navigateTo: (place) => dispatch(push(place))
  }
}

const CreateNewElement = connect(
  mapStateToProps,
  mapDispatchToProps
)(NewElement)

export default CreateNewElement
