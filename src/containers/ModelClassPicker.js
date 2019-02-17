import { connect } from 'react-redux'
import AnchoredPicker from '../components/pickers/AnchoredPicker'
import { addElementModelClass } from '../actions/elements'
import { addMembershipToClass } from '../actions/classes'

const mapStateToProps = (state) => {
  const customClasses = state.odd.customization.json.classes.models
  return {items: customClasses, pickerType: 'models',
    message: `Not seeing a class you're looking for? <a href='#'>Manage classes</a>  (Coming soon)`}
}

const mapDispatchToProps = (dispatch, ownProps) => {
  let add = (type, item) => {
    dispatch(addElementModelClass(ownProps.member, item.ident))
  }
  if (ownProps.memberType === 'classSpec') {
    add = (type, item) => {
      dispatch(addMembershipToClass(ownProps.member, item.ident, 'model'))
    }
  }
  return { add }
}

const ModelClassPicker = connect(
  mapStateToProps,
  mapDispatchToProps
)(AnchoredPicker)

export default ModelClassPicker
