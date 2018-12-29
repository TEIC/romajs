import { connect } from 'react-redux'
import ClassAttributes from '../components/ClassAttributes'
// import { deleteClassAttribute, restoreClassAttribute, restoreClassAttributeDeletedOnClass, changeElementAttribute,
//   useClassDefault, changeClassAttribute, restoreElementAttribute } from '../actions/classes'
import { deleteClassAttribute, restoreClassAttribute, addClassAttribute } from '../actions/classes'
import { clearPicker } from '../actions/interface'
import { push } from 'react-router-redux'
import {clone} from '../utils/clone'

const mapStateToProps = (state, ownProps) => {
  const klass = clone(ownProps.member)

  // Get member classes
  const memberClasses = []

  const localClasses = state.odd.localsource.json.classes.attributes.filter((lc) => {
    if (lc.classes) {
      return lc.classes.atts.indexOf(klass.ident) !== -1
    }
    return false
  })

  for (const lc of localClasses) {
    let curClass
    const c = state.odd.customization.json.classes.attributes.filter(ac => (ac.ident === lc.ident))[0]
    if (c) {
      curClass = clone(c)
    } else {
      curClass = clone(lc)
      curClass.deleted = true
      curClass.attributes.forEach(a => {
        a.deleted = true
      })
    }
    memberClasses.push(curClass)
  }

  // Sort classes based on active/inactive
  memberClasses.sort((a, b) => {
    return a.ident > b.ident
  })

  // Check for deleted attributes that were defined on this class only
  // ie are not inherited from a class.
  const localClass = state.odd.localsource.json.classes.attributes.filter(le => (le.ident === klass.ident))[0]
  for (const att of klass.attributes) {
    if (att.mode === 'delete') {
      att.shortDesc = localClass.attributes.filter(a => (a.ident === att.ident))[0].shortDesc
      att.deleted = true
      att.onClass = true
    }
  }

  // Sort attributes
  klass.attributes.sort((a, b) => {
    return a.ident > b.ident
  })

  // Get class memberships
  const memberships = []
  if (klass.classes) {
    for (const ident of klass.classes.atts) {
      const customClass = state.odd.customization.json.classes.attributes.filter(ac => (ac.ident === ident))[0]
      const shortDesc = customClass ? customClass.shortDesc : localClass.shortDesc
      if (customClass && customClass.mode !== 'deleted') {
        memberships.push({ident, mode: 'add', shortDesc})
      } else {
        memberships.push({ident, mode: 'deleted', shortDesc})
      }
    }
  }

  return {member: klass, memberType: 'class', memberships, memberClasses, path: state.router.location.pathname}
}

const mapDispatchToProps = (dispatch) => {
  return {
    navigateTo: (place) => dispatch(push(place)),
    deleteMemberAttribute: (member, attribute) => dispatch(deleteClassAttribute(member, attribute)),
    restoreMemberAttribute: (member, attribute) => dispatch(restoreClassAttribute(member, attribute)),
    deleteElementAttributeClass: () => null,
    clearPicker: () => dispatch(clearPicker()),
    restoreElementAttributeClass: () => null,
    deleteClassAttribute: () => null,
    restoreClassAttribute: () => null,
    editAttribute: () => null,
    editClassAttribute: () => null,
    restoreClassAttributeDeletedOnClass: () => null,
    useClassDefault: () => null,
    addMemberAttribute: (member, attribute) => addClassAttribute(member, attribute)
  }
}

const EditAttributes = connect(
  mapStateToProps,
  mapDispatchToProps
)(ClassAttributes)

export default EditAttributes
