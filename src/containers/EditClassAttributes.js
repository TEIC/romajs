import { connect } from 'react-redux'
import ClassAttributes from '../components/ClassAttributes'
import { deleteClassAttribute, restoreClassAttribute, addClassAttribute, removeMembershipToClass,
  changeClassAttribute, addMembershipToClass } from '../actions/classes'
import { clearPicker } from '../actions/interface'
import { push } from 'react-router-redux'
import {clone} from '../utils/clone'

const mapStateToProps = (state, ownProps) => {
  const klass = clone(ownProps.member)

  // Get member classes
  // Merge local classes with custom classes (as they may be new)
  const mergedClasses = new Set()
  for (const lc of state.odd.localsource.json.classes.attributes) {
    if (lc.classes && lc.classes.atts) {
      if (lc.classes.atts.indexOf(klass.ident) !== -1) {
        mergedClasses.add(lc.ident)
      }
    }
  }
  for (const lc of state.odd.customization.json.classes.attributes) {
    if (lc.classes && lc.classes.atts) {
      if (lc.classes.atts.indexOf(klass.ident) !== -1) {
        mergedClasses.add(lc.ident)
      }
    }
  }

  const memberClasses = []

  for (const lc of Array.from(mergedClasses)) {
    let curClass
    const c = state.odd.customization.json.classes.attributes.filter(ac => (ac.ident === lc))[0]
    if (c) {
      curClass = clone(c)
    } else {
      curClass = clone(state.odd.localsource.json.classes.attributes.filter((ac) => ac.ident === lc )[0])
      curClass.deleted = true
      curClass.attributes.forEach(a => {
        a.deleted = true
      })
    }
    memberClasses.push(curClass)
  }

  // Sort classes based on active/inactive
  memberClasses.sort((a, b) => {
    return a.ident.toLowerCase() > b.ident.toLowerCase()
  })

  // Check for deleted attributes that were defined on this class only
  // ie are not inherited from a class.
  const localClass = state.odd.localsource.json.classes.attributes.filter(le => (le.ident === klass.ident))[0]
  for (const att of klass.attributes) {
    if (att.mode === 'delete') {
      const localAtt = localClass.attributes.filter(a => (a.ident === att.ident))[0]
      if (!localAtt) {
        // the attribute being deleted does not exist in the local source.
        att.shortDesc = ''
        att.noeffect = true
      } else {
        att.shortDesc = localAtt.shortDesc
      }
      att.deleted = true
      att.onClass = true
    }
  }

  // Sort attributes
  klass.attributes.sort((a, b) => {
    return a.ident.toLowerCase() > b.ident.toLowerCase()
  })

  // Get class memberships
  // Merge local classes with custom classes (as they may be new)
  const mergedSubClasses = new Set()
  if (localClass && localClass.classes) {
    for (const ident of localClass.classes.atts) {
      mergedSubClasses.add(ident)
    }
  }
  if (klass.classes) {
    for (const ident of klass.classes.atts) {
      mergedSubClasses.add(ident)
    }
  }

  const memberships = []
  for (const ident of Array.from(mergedSubClasses)) {
    let listed = true
    if (klass.classes) {
      if (klass.classes.atts.indexOf(ident) === -1) listed = false
    } else {
      listed = false
    }
    const customClass = state.odd.customization.json.classes.attributes.filter(ac => (ac.ident === ident))[0]
    const shortDesc = customClass ? customClass.shortDesc : localClass.shortDesc
    const attributes = customClass ? customClass.attributes : localClass.attributes
    if (customClass && listed) {
      memberships.push({ident, mode: 'add', shortDesc, attributes})
    } else if (customClass && !listed) {
      memberships.push({ident, mode: 'deleted', shortDesc, attributes})
    } else {
      memberships.push({ident, mode: 'not available', shortDesc, attributes})
    }
  }

  const availableSorted = memberships.filter(a => (a.mode === 'add')).sort((a, b) => {
    return a.ident.toLowerCase() > b.ident.toLowerCase()
  })

  const deletedSorted = memberships.filter(a => (a.mode === 'deleted')).sort((a, b) => {
    return a.ident.toLowerCase() > b.ident.toLowerCase()
  })

  const notAvailableSorted = memberships.filter(a => (a.mode === 'not available')).sort((a, b) => {
    return a.ident.toLowerCase() > b.ident.toLowerCase()
  })

  const memberShipsSorted = [...availableSorted, ...deletedSorted, ...notAvailableSorted]

  return {member: klass, memberType: 'class', memberships: memberShipsSorted, memberClasses, path: state.router.location.pathname}
}

const mapDispatchToProps = (dispatch) => {
  return {
    navigateTo: (place) => dispatch(push(place)),
    deleteMemberAttribute: (member, attribute) => dispatch(deleteClassAttribute(member, attribute)),
    restoreMemberAttribute: (member, attribute) => dispatch(restoreClassAttribute(member, attribute)),
    clearPicker: () => dispatch(clearPicker()),
    editAttribute: (className, attName, path) => {
      dispatch(changeClassAttribute(className, attName))
      dispatch(push(`${path}/${attName}`))
    },
    // not sure why dispatch is not needed below, but using it causes the reducer (not the action) to be dispatched twice.
    addMemberAttribute: (member, attribute) => addClassAttribute(member, attribute),
    removeMembershipToClass: (member, className) => dispatch(removeMembershipToClass(member, className, 'atts')),
    addMembershipToClass: (member, className) => dispatch(addMembershipToClass(member, className, 'atts'))
  }
}

const EditAttributes = connect(
  mapStateToProps,
  mapDispatchToProps
)(ClassAttributes)

export default EditAttributes
