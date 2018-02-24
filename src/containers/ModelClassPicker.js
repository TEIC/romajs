import { connect } from 'react-redux'
import AnchoredPicker from '../components/pickers/AnchoredPicker'
import { addElementModelClass } from '../actions/elements'

const mapStateToProps = (state) => {
  const customClasses = state.odd.customization.json.classes.models
  const customClassNames = customClasses.reduce((acc, cn) => {
    acc.push(cn.ident)
    return acc
  }, [])
  const localClasses = state.odd.localsource.json.classes.models

  // Get all classes from localsource that are not customized
  let classes = localClasses.filter((lc) => {
    return customClassNames.indexOf(lc.ident) === -1
  })
  // join with custom classes
  classes = classes.concat(customClasses)
  return {items: classes, pickerType: 'models'}
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
