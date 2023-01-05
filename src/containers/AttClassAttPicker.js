import { connect } from 'react-redux'
import AnchoredPicker from '../components/pickers/AnchoredPicker'
import { addMembershipToClass } from '../actions/classes'

const mapStateToProps = (state, ownProps) => {
  const customClasses = state.odd.customization.json.classes.attributes
  return {items: customClasses, pickerType: 'attributes',
    message: ownProps.message, language: state.ui.language}
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    add: (type, item) => {
      dispatch(addMembershipToClass(ownProps.member, item.ident, 'atts'))
    }
  }
}

const AttClassAttPicker = connect(
  mapStateToProps,
  mapDispatchToProps
)(AnchoredPicker)

export default AttClassAttPicker
