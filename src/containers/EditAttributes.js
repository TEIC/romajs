import { connect } from 'react-redux'
import Attributes from '../components/Attributes'
import { deleteElementAttributeClass, restoreElementAttributeClass, deleteElementAttribute,
  deleteClassAttribute, restoreClassAttribute, restoreClassAttributeDeletedOnClass, changeElementAttribute,
  useClassDefault, changeClassAttribute, restoreElementAttribute, addElementAttribute } from '../actions/elements'
import { clearPicker } from '../actions/interface'
import { push } from 'react-router-redux'
import {clone} from '../utils/clone'

const mapStateToProps = (state, ownProps) => {
  const element = clone(ownProps.element)
  const localElement = state.odd.localsource.json.elements.filter(le => (le.ident === element.ident))[0]

  let deletedAttributesFromClasses = new Set()
  const flattenedAttList = []

  const getClasses = (classNames, sub = false, from = '') => {
    // Get attribute classes
    return classNames.reduce((acc, className) => {
      const localClass = state.odd.localsource.json.classes.attributes.filter((lc) => (lc.ident === className))[0]
      const c = state.odd.customization.json.classes.attributes.filter(ac => (ac.ident === className))[0]
      const _computeAtts = (classToClone) => {
        let tempAcc = Array.from(acc)
        // clone class
        const curClass = clone(classToClone)
        curClass.sub = sub
        curClass.from = from
        curClass.deletedAttributes = new Map()
        // We check against the localsource to obtain attributes that have been deleted
        // (ie do not appear in customization)
        if (localClass) {
          for (const localAtt of localClass.attributes) {
            if (!classToClone.attributes.filter((a) => (a.ident === localAtt.ident))[0]) {
              curClass.deletedAttributes.set(localAtt.ident, {fromCustomizationODD: true})
              curClass.attributes.push(Object.assign({}, localAtt, {mode: 'delete', deleted: true, overridden: false, deletedOnClass: true}))
            }
          }
        }

        for (const att of curClass.attributes) {
          if (att.mode === 'delete') {
            // Also keep track of attributes marked to be deleted (mode = delete) in the current session
            // and adjust their data model for the UI
            curClass.deletedAttributes.set(att.ident, {fromCustomizationODD: false})
            att.deleted = true
            att.overridden = false
            att.deletedOnClass = true

            if (!localClass.attributes.filter(a => (a.ident === att.ident))[0]) {
            // Deal with wrongly removed attributes (e.g. they don't exist in the localclass or customization)
              att.noeffect = true
            }
          }
          // Check if a definition in the element overrides or deletes an inherited attribute
          const redefinedAtt = element.attributes.filter((a) => (a.ident === att.ident))[0]
          if (redefinedAtt) {
            att.overridden = false
            att.deleted = false
            att.mode = redefinedAtt.mode
            if (redefinedAtt.mode === 'delete') {
              att.deleted = true
              curClass.deletedAttributes.set(att.ident, {fromCustomizationODD: true})
            } else if (redefinedAtt.mode === 'change' || redefinedAtt.mode === 'add') {
              curClass.deletedAttributes.delete(att.ident)
              // TODO: setting overridden when _changed is NOT specified seems risky.
              if (redefinedAtt._changed === undefined || redefinedAtt._changed.length > 0 || redefinedAtt._restoredAfterDeletedOnClass) {
                att.overridden = true
              }
            }
          }
        }

        if (curClass.attributes.length > 0
          && curClass.deletedAttributes.size >= curClass.attributes.length) {
          curClass.inactive = true
        } else if (curClass.attributes.length === 0) {
          curClass.noattributes = true
        }
        tempAcc.push(curClass)
        // Get inherited classes from both customization and localsource
        const subClasses = curClass.classes ? new Set(curClass.classes.atts) : new Set()
        if (localClass && localClass.classes) {
          for (const cl of localClass.classes.atts) {
            subClasses.add(cl)
          }
        }
        if (subClasses.size > 0) {
          tempAcc = tempAcc.concat(getClasses(Array.from(subClasses), true, curClass.ident))
        }

        flattenedAttList.push(...curClass.attributes.map(a => a.ident))

        // store list of deleted attributes
        deletedAttributesFromClasses = new Set([...deletedAttributesFromClasses, ...curClass.deletedAttributes])
        return tempAcc
      }
      if (c) {
        return _computeAtts(c)
      } else {
        // The class requested doesn't appear to be in the customization,
        // but if its module is selected, it may have been zapped. So include it.
        // BUT do not restore it if it's been explicitly deleted by the user.
        if (state.odd.localsource.json.modules.filter(m => m.ident === localClass.module)[0]
          && state.odd.customization.json.classes._deleted
          && !state.odd.customization.json.classes._deleted.includes(className)) {
          return _computeAtts(localClass)
        }
        return acc
      }
    }, [])
  }

  // Get attribute classes
  let attsfromClasses = []

  if (element.classes) {
    attsfromClasses = getClasses(element.classes.atts)
  }

  // Find out deleted class memberships and add them so that they can be restored by user.
  if (localElement.classes && localElement.classes.atts) {
    const computedClasses = new Set(attsfromClasses.map(c => c.ident))
    const deletedClassesNames = localElement.classes.atts.filter(c => !computedClasses.has(c))
    const deletedClasses = getClasses(deletedClassesNames)
    attsfromClasses = attsfromClasses.concat(deletedClasses.map(cl => {
      cl.inactive = true
      cl.attributes.forEach(a => {
        a.mode = 'delete'
        a.deleted = true
        a.overridden = false
        cl.deletedAttributes.set(a.ident, {fromCustomizationODD: true})
      })
      return cl
    }))
  }

  // Sort classes based on active/inactive
  attsfromClasses.sort((a, b) => {
    return a.ident > b.ident
  })

  for (const att of element.attributes) {
    // If the attribute is already listed in a class, don't show it.
    if (flattenedAttList.indexOf(att.ident) !== -1) {
      att.onElement = false
    }
    // Check for deleted attributes that were defined on the element only
    // ie are not inherited from a class.
    if (att.mode === 'delete' && att.onElement && !att._isNew) {
      att.shortDesc = (localElement.attributes.filter(a => (a.ident === att.ident))[0] || {}).shortDesc
      att.deleted = true
    } else if (deletedAttributesFromClasses.has(att.ident)) {
      // Skip this attribute if it's modifying a class element
      att.onElement = false
    }
  }

  // Sort element attributes
  element.attributes.sort((a, b) => {
    return a.ident > b.ident
  })

  return {member: element, memberType: 'element', attsfromClasses, path: state.router.location.pathname,
    language: state.ui.language}
}

const mapDispatchToProps = (dispatch) => {
  return {
    navigateTo: (place) => dispatch(push(place)),
    deleteMemberAttribute: (element, attribute) => dispatch(deleteElementAttribute(element, attribute)),
    restoreMemberAttribute: (element, attribute) => dispatch(restoreElementAttribute(element, attribute)),
    deleteElementAttributeClass: (element, className) => dispatch(deleteElementAttributeClass(element, className)),
    clearPicker: () => dispatch(clearPicker()),
    restoreElementAttributeClass: (element, className, deletedAttributes) => dispatch(restoreElementAttributeClass(element, className, deletedAttributes)),
    deleteClassAttribute: (element, className, attName) => dispatch(deleteClassAttribute(element, className, attName)),
    restoreClassAttribute: (element, attName) => dispatch(restoreClassAttribute(element, attName)),
    editAttribute: (element, attName, path) => {
      dispatch(changeElementAttribute(element, attName))
      dispatch(push(`${path}/${attName}`))
    },
    editClassAttribute: (element, className, attName, path) => {
      dispatch(changeClassAttribute(element, className, attName))
      dispatch(push(`${path}/${attName}`))
    },
    restoreClassAttributeDeletedOnClass: (element, className, attName) => {
      dispatch(restoreClassAttributeDeletedOnClass(element, className, attName))
    },
    useClassDefault: (element, attName) => dispatch(useClassDefault(element, attName)),
    addMemberAttribute: (element, attribute) => addElementAttribute(element, attribute)
  }
}

const EditAttributes = connect(
  mapStateToProps,
  mapDispatchToProps
)(Attributes)

export default EditAttributes
