import { connect } from 'react-redux'
import Attributes from '../components/Attributes'
import { deleteElementAttributeClass, restoreElementAttributeClass, deleteClassAttribute, restoreClassAttribute } from '../actions/elements'
import { clearPicker } from '../actions/interface'
import { push } from 'react-router-redux'

const mapStateToProps = (state, ownProps) => {
  const element = ownProps.element
  // Get attribute classes
  const getClasses = (classNames, sub = false) => {
    return state.odd.customization.json.classes.attributes.reduce((acc, c) => {
      let tempAcc = Array.from(acc)
      if (classNames.indexOf(c.ident) !== -1) {
        c.sub = sub
        c.inactive = false
        // Check if a local definition overrides or deletes an inhereted attribute
        let numDeleted = 0
        for (const att of c.attributes) {
          att.deleted = false
          att.overridden = false
          const redefinedAtt = element.attributes.filter((a) => (a.ident === att.ident))[0]
          if (redefinedAtt) {
            if (redefinedAtt.mode === 'delete') {
              att.deleted = true
              numDeleted++
            } else if (redefinedAtt.mode === 'change' || redefinedAtt.mode === 'add') {
              att.overridden = true
            }
          }
        }
        if (numDeleted === c.attributes.length) {
          c.inactive = true
        }
        tempAcc.push(c)
        if (c.classes) {
          tempAcc = tempAcc.concat(getClasses(c.classes.atts, true))
        }
      }
      return tempAcc
    }, [])
  }

  const attsfromClasses = getClasses(element.classes.atts)

  return {element, attsfromClasses, path: state.router.location.pathname}
}

const mapDispatchToProps = (dispatch) => {
  return {
    navigateTo: (place) => dispatch(push(place)),
    deleteElementAttributeClass: (element, className) => dispatch(deleteElementAttributeClass(element, className)),
    clearPicker: () => dispatch(clearPicker()),
    restoreElementAttributeClass: (element, className) => dispatch(restoreElementAttributeClass(element, className)),
    deleteClassAttribute: (element, className, attName) => dispatch(deleteClassAttribute(element, className, attName)),
    restoreClassAttribute: (element, attName) => dispatch(restoreClassAttribute(element, attName))
  }
}

const EditAttributes = connect(
  mapStateToProps,
  mapDispatchToProps
)(Attributes)

export default EditAttributes
