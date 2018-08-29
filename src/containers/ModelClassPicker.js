import { connect } from 'react-redux'
import AnchoredPicker from '../components/pickers/AnchoredPicker'
import { addElementModelClass } from '../actions/elements'

const mapStateToProps = (state) => {
  const customClasses = state.odd.customization.json.classes.models
  return {items: customClasses, pickerType: 'models',
    message: `Not seeing a class you're looking for? <a href='#'>Manage classes</a>`}
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    add: (type, item) => {
      dispatch(addElementModelClass(ownProps.element, item.ident))
    }
  }
}

const ModelClassPicker = connect(
  mapStateToProps,
  mapDispatchToProps
)(AnchoredPicker)

export default ModelClassPicker
