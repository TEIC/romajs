import { connect } from 'react-redux'
import ModelClassMemberships from '../components/ModelClassMemberships'
import { removeMembershipToClass, addMembershipToClass } from '../actions/classes'
import { clearPicker } from '../actions/interface'
import { push } from 'react-router-redux'
import {clone} from '../utils/clone'

// TODO: This may be consolidated with attribute class logic to some extent.
const mapStateToProps = (state, ownProps) => {
  const klass = clone(ownProps.member)
  const localClass = state.odd.localsource.json.classes.models.filter(le => (le.ident === klass.ident))[0]

  // Get member classes
  const memberClasses = []

  const localClasses = state.odd.localsource.json.classes.models.filter((lc) => {
    if (lc.classes) {
      return lc.classes.model.indexOf(klass.ident) !== -1
    }
    return false
  })

  for (const lc of localClasses) {
    let curClass
    const c = state.odd.customization.json.classes.models.filter(ac => (ac.ident === lc.ident))[0]
    if (c) {
      curClass = clone(c)
    } else {
      curClass = clone(lc)
      curClass.deleted = true
      curClass.models.forEach(a => {
        a.deleted = true
      })
    }
    memberClasses.push(curClass)
  }

  // Sort classes based on active/inactive
  memberClasses.sort((a, b) => {
    return a.ident.toLowerCase() > b.ident.toLowerCase()
  })

  // Get class memberships
  const memberships = []
  if (localClass.classes) {
    for (const ident of localClass.classes.model) {
      let listed = true
      console.log(klass.classes)
      if (klass.classes) {
        if (klass.classes.model.indexOf(ident) === -1) listed = false
      } else {
        listed = false
      }
      const customClass = state.odd.customization.json.classes.models.filter(ac => (ac.ident === ident))[0]
      const shortDesc = customClass ? customClass.shortDesc : localClass.shortDesc
      if (customClass && listed) {
        memberships.push({ident, mode: 'add', shortDesc})
      } else if (customClass && !listed) {
        memberships.push({ident, mode: 'deleted', shortDesc})
      } else {
        memberships.push({ident, mode: 'not available', shortDesc})
      }
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
    clearPicker: () => dispatch(clearPicker()),
    removeMembershipToClass: (member, className) => dispatch(removeMembershipToClass(member, className, 'model')),
    addMembershipToClass: (member, className) => dispatch(addMembershipToClass(member, className, 'model'))
  }
}

const EditModelClassMemberships = connect(
  mapStateToProps,
  mapDispatchToProps
)(ModelClassMemberships)

export default EditModelClassMemberships
