import { connect } from 'react-redux'
import Element from '../components/Element'
import { push } from 'react-router-redux'
import { deleteElementModelClass, deleteElementAttributeClass } from '../actions/elements'
import { clearPicker } from '../actions/interface'

const mapStateToProps = (state, ownProps) => {
  let element = null
  let success = false
  // TODO: Also don't set success to true if the element hasn't been selected
  if (state.odd.customization && state.odd.localsource) {
    if (!state.odd.customization.isFetching && !state.odd.localsource.isFetching) {
      const customEl = state.odd.customization.json.elements.filter(x => {
        return (x.ident === ownProps.match.params.el)
      })[0]
      if (!customEl) {
        const localEl = state.odd.localsource.json.elements.filter(x => {
          return (x.ident === ownProps.match.params.el)
        })[0]
        if (localEl) {
          element = localEl
          success = true
        }
      } else {
        element = customEl
        success = true
      }
      // Get class descriptions
      const classes = element.classes.model.concat(element.classes.atts)
      const customClasses = state.odd.customization.json.classes.models.concat(
        state.odd.customization.json.classes.attributes)
      const localClasses = state.odd.localsource.json.classes.models.concat(
        state.odd.localsource.json.classes.attributes)
      element.classDescs = classes.reduce((descs, className) => {
        let classData = null
        const customClass = customClasses.filter(x => {
          return (x.ident === className)
        })[0]
        if (!customClass) {
          const localClass = localClasses.filter(x => {
            return (x.ident === className)
          })[0]
          if (localClass) {
            classData = localClass
          }
        } else {
          classData = customClass
        }
        descs[className] = classData.shortDesc
        return descs
      }, {})
    }
  }
  return {element, success}
}

const mapDispatchToProps = (dispatch) => {
  return {
    navigateTo: (place) => dispatch(push(place)),
    deleteElementModelClass: (element, className) => dispatch(deleteElementModelClass(element, className)),
    deleteElementAttributeClass: (element, className) => dispatch(deleteElementAttributeClass(element, className)),
    clearPicker: () => dispatch(clearPicker())
  }
}

const ElementPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(Element)

export default ElementPage
