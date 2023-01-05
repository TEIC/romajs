import { connect } from 'react-redux'
import NewClass from '../components/dialogs/NewClass'
import { createNewClass } from '../actions/classes'
import { push } from 'react-router-redux'

const mapStateToProps = (state) => {
  const allCustomClasses = state.odd.customization.json.classes.attributes.concat(
    state.odd.customization.json.classes.models)
  const allLocalClasses = state.odd.localsource.json.classes.attributes.concat(
    state.odd.localsource.json.classes.models)
  const allClassIdents = new Set(allLocalClasses.map(cl => cl.ident))
  for (const cl of allCustomClasses) {
    allClassIdents.add(cl.ident)
  }
  return { oddname: state.odd.customization.settings.filename, modules: state.odd.customization.json.modules,
    allClassIdents: Array.from(allClassIdents), language: state.ui.language }
}

const mapDispatchToProps = (dispatch) => {
  return {
    createNewClass: (name, module, type) => {
      dispatch(createNewClass(name, module, type))
    },
    navigateTo: (place) => dispatch(push(place))
  }
}

const CreateNewClass = connect(
  mapStateToProps,
  mapDispatchToProps
)(NewClass)

export default CreateNewClass
