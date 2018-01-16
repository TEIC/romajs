import { connect } from 'react-redux'
import Picker from '../components/Picker'
import {addFromPicker} from '../actions/interface'

const mapStateToProps = (state) => {
  const customClasses = state.odd.customization.json.classes.attributes
  const customClassNames = customClasses.reduce((acc, cn) => {
    acc.push(cn.ident)
    return acc
  }, [])
  const localClasses = state.odd.localsource.json.classes.attributes

  // Get all classes from localsource that are not customized
  let classes = localClasses.filter((lc) => {
    return customClassNames.indexOf(lc.ident) === -1
  })
  // join with custom classes
  classes = classes.concat(customClasses)
  return {items: classes, pickerType: 'attributes'}
}

const mapDispatchToProps = (dispatch) => {
  return {
    add: (type, item) => dispatch(addFromPicker(type, item))
  }
}

const AttClassPicker = connect(
  mapStateToProps,
  mapDispatchToProps
)(Picker)

export default AttClassPicker
