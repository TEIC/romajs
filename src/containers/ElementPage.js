import { connect } from 'react-redux'
import Element from '../components/Element'
import { push } from 'react-router-redux'
import { deleteElementModelClass } from '../actions/elements'
import { clearPicker } from '../actions/interface'

const mapStateToProps = (state, ownProps) => {
  let element = null
  let success = false
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
        const customClass = customClasses.filter(x => (x.ident === className))[0]
        if (!customClass) {
          const localClass = localClasses.filter(x => (x.ident === className))[0]
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
  // Handle attribute subsection
  let section = ownProps.match.params.section
  let attribute
  if (ownProps.match.path.includes('attributes/:attr')) {
    section = 'attributes'
    attribute = ownProps.match.params.attr
  }
  return {element, success, section, attribute}
}

const mapDispatchToProps = (dispatch) => {
  return {
    navigateTo: (place) => dispatch(push(place)),
    deleteElementModelClass: (element, className) => dispatch(deleteElementModelClass(element, className)),
    clearPicker: () => dispatch(clearPicker())
  }
}

const ElementPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(Element)

export default ElementPage
