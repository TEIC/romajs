import { connect } from 'react-redux'
import AnchoredPicker from '../components/pickers/AnchoredPicker'
import { addMembershipToClass } from '../actions/classes'

const mapStateToProps = (state) => {
  const customClasses = state.odd.customization.json.classes.attributes
  return {items: customClasses, pickerType: 'attributes',
    message: `Not seeing a class you're looking for? Return to <a href="/members">members selection page</a>.`}
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
