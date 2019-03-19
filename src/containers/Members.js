import { connect } from 'react-redux'
import { includeElements, excludeElements, includeClasses, excludeClasses, includeDatatypes, excludeDatatypes } from '../actions/modules'
import { restoreElementMembershipsToClass, clearElementMembershipsToClass } from '../actions/elements'
import { restoreMembershipsToClass, clearMembershipsToClass } from '../actions/classes'
import { clearUiData, setMemberTypeVisibility, sortMembersBy } from '../actions/interface'
import MembersList from '../components/MembersList'

const mapStateToProps = (state) => {
  let allMembers = []
  let elements = []
  let attclasses = []
  let modelclasses = []
  let datatypes = []
  const visibleMemberTypes = state.ui.visibleMemberTypes || ['elements']
  let isLoading = true
  if (state.odd.customization && state.odd.localsource) {
    if (!state.odd.customization.isFetching && !state.odd.localsource.isFetching) {
      isLoading = false
      const customization = state.odd.customization.json
      const localsource = state.odd.localsource.json

      // If a filterTerm is set, use it to filter results
      const filter = state.ui.filterTerm ? state.ui.filterTerm : false

      // Function to determine which members are selected
      const getMembers = (memberType, memberSubType) => {
        const localMembers = memberSubType ? localsource[memberType][memberSubType] : localsource[memberType]
        const customMembers = memberSubType ? customization[memberType][memberSubType] : customization[memberType]
        const members =  localMembers.reduce((acc, localMember) => {
          let member = Object.assign({}, localMember)
          const customMember = customMembers.filter(m => (m.ident === localMember.ident))[0]
          if (customMember) {
            member = Object.assign({}, customMember)
            member.selected = true
            member.module_selected = true
          } else {
            member.selected = false
            if (customization.modules.filter(m => (m.ident === member.module))[0]) {
              member.module_selected = true
            } else {
              member.module_selected = false
            }
          }
          // member.visible = true
          member.type = memberType
          member.subType = memberSubType
          acc.push(member)
          return acc
        }, [])
        // Identify members defined in the customizion ONLY.
        const a = customMembers.reduce((acc, customMember) => {
          if (!localMembers.filter(m => (m.ident === customMember.ident))[0]) {
            customMember.isNew = true
            customMember.selected = true
            customMember.module_selected = true
            // customMember.visible = true
            customMember.type = memberType
            customMember.subType = memberSubType
            acc.push(customMember)
          }
          return acc
        }, [])
        return members.concat(a)
      }

      // Function to filter members based on user input
      const filterMembers = (members) => {
        return members.reduce((acc, member) => {
          const options = state.ui.filterOptions || {}
          if (options.fullMatch) {
            if (member.ident.toLowerCase() === filter.toLowerCase()) {
              member.highlight = filter
              acc.push(member)
            }
          } else {
            if (member.ident.toLowerCase().includes(filter.toLowerCase())) {
              member.highlight = filter
              acc.push(member)
            }
          }
          return acc
        }, [])
      }

      // Get the members, based on visibility
      if (visibleMemberTypes.indexOf('elements') !== -1) {
        elements = getMembers('elements')
      }
      if (visibleMemberTypes.indexOf('attclasses') !== -1) {
        attclasses = getMembers('classes', 'attributes')
      }
      if (visibleMemberTypes.indexOf('modelclasses') !== -1) {
        modelclasses = getMembers('classes', 'models')
      }
      if (visibleMemberTypes.indexOf('datatypes') !== -1) {
        datatypes = getMembers('datatypes')
      }

      // apply filter
      if (filter) {
        elements = filterMembers(elements)
        attclasses = filterMembers(attclasses)
        modelclasses = filterMembers(modelclasses)
        datatypes = filterMembers(datatypes)
      }
      // Finally, concat and sort alphabetically
      allMembers = elements.concat(attclasses)
      allMembers = allMembers.concat(modelclasses)
      allMembers = allMembers.concat(datatypes)
      allMembers.sort((a, b) => {
        if (a.ident.toLowerCase() > b.ident.toLowerCase()) {
          return 1
        } else {
          return (b.ident.toLowerCase() > a.ident.toLowerCase()) ? -1 : 0
        }
      })

      // sort by module
      if (state.ui.sortMembersBy === 'module') {
        allMembers.sort((a, b) => {
          if (a.module.toLowerCase() > b.module.toLowerCase()) {
            return 1
          } else {
            return (b.module.toLowerCase() > a.module.toLowerCase()) ? -1 : 0
          }
        })
      }
    }
  }
  return {
    members: allMembers, visibleMemberTypes, loadingStatus: state.ui.loadingStatus,
    language: state.ui.language, isLoading, sortBy: state.ui.sortMembersBy || 'element'
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    toggleItem: (name, selected, type) => {
      if (selected) {
        switch (type) {
          case 'element':
            dispatch(excludeElements([name], type))
            break
          case 'attributes':
          case 'models':
            dispatch(excludeClasses([name], type))
            dispatch(clearMembershipsToClass(name, type))
            dispatch(clearElementMembershipsToClass(name, type))
            break
          case 'datatype':
            dispatch(excludeDatatypes([name], type))
            break
          default:
        }
      } else {
        switch (type) {
          case 'element':
            dispatch(includeElements([name], type))
            break
          case 'attributes':
          case 'models':
            dispatch(includeClasses([name], type))
            dispatch(restoreMembershipsToClass(name, type))
            dispatch(restoreElementMembershipsToClass(name, type))
            break
          case 'datatype':
            dispatch(includeDatatypes([name], type))
            break
          default:
        }
      }
    },
    setMemberTypeVisibility: (visibleMemberTypes) => {
      dispatch(setMemberTypeVisibility(visibleMemberTypes))
    },
    clearUiData: () => dispatch(clearUiData()),
    sortMembersBy: (mode) => dispatch(sortMembersBy(mode))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MembersList)
