import { connect } from 'react-redux'
import NewDatatype from '../components/dialogs/NewDatatype'
import { createNewDatatype } from '../actions/datatypes'
import { push } from 'react-router-redux'

const mapStateToProps = (state) => {
  const allDtIdents = new Set(state.odd.localsource.json.datatypes.map(dt => dt.ident))
  for (const dt of state.odd.customization.json.datatypes) {
    allDtIdents.add(dt.ident)
  }
  return { oddname: state.odd.customization.settings.filename, modules: state.odd.customization.json.modules,
    allDatatypeIdents: Array.from(allDtIdents), language: state.ui.language }
}

const mapDispatchToProps = (dispatch) => {
  return {
    createNewDatatype: (name, module) => {
      dispatch(createNewDatatype(name, module))
    },
    navigateTo: (place) => dispatch(push(place))
  }
}

const CreateNewDatatype = connect(
  mapStateToProps,
  mapDispatchToProps
)(NewDatatype)

export default CreateNewDatatype
