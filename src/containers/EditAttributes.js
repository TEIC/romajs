import { connect } from 'react-redux'
import Attributes from '../components/Attributes'
import { deleteElementAttributeClass } from '../actions/elements'
import { clearPicker } from '../actions/interface'

const mapStateToProps = (state, ownProps) => {
  const element = ownProps.element
  // Get attribute classes
  const getClasses = (classNames) => {
    return state.odd.customization.json.classes.attributes.reduce((acc, c) => {
      let tempAcc = Array.from(acc)
      if (classNames.indexOf(c.ident) !== -1) {
        // Check if a local definition overrides an inhereted attribute
        for (const att of c.attributes) {
          if (element.attributes.filter((a) => a.ident === att.ident).length > 0) {
            att.overridden = true
          }
        }
        tempAcc.push(c)
        if (c.classes) {
          tempAcc = tempAcc.concat(getClasses(c.classes.atts))
        }
      }
      return tempAcc
    }, [])
  }

  const attsfromClasses = getClasses(element.classes.atts)

  return {element, attsfromClasses}
}

const mapDispatchToProps = (dispatch) => {
  return {
    deleteElementAttributeClass: (element, className) => dispatch(deleteElementAttributeClass(element, className)),
    clearPicker: () => dispatch(clearPicker())
  }
}

const EditAttributes = connect(
  mapStateToProps,
  mapDispatchToProps
)(Attributes)

export default EditAttributes
