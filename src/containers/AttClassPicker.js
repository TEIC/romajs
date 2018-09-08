import { connect } from 'react-redux'
import AnchoredPicker from '../components/pickers/AnchoredPicker'
import { addElementAttributeClass } from '../actions/elements'

const mapStateToProps = (state) => {
  const customClasses = state.odd.customization.json.classes.attributes
  return {items: customClasses, pickerType: 'attributes',
    message: `Not seeing a class you're looking for? <a href='#'>Manage classes</a>  (Coming soon)`}
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    add: (type, item) => {
      dispatch(addElementAttributeClass(ownProps.element, item.ident))
    }
  }
}

const AttClassPicker = connect(
  mapStateToProps,
  mapDispatchToProps
)(AnchoredPicker)

export default AttClassPicker
