import { connect } from 'react-redux'
import { includeElements, excludeElements } from '../actions/modules'
import { clearUiData, setMemberTypeVisibility } from '../actions/interface'
import MembersList from '../components/MembersList'

const mapStateToProps = (state) => {
  let allMembers = []
  let elements = []
  let attclasses = []
  const visibleMemberTypes = state.ui.visibleMemberTypes || []
  if (state.odd.customization && state.odd.localsource) {
    if (!state.odd.customization.isFetching && !state.odd.localsource.isFetching) {
      const customization = state.odd.customization.json
      const localsource = state.odd.localsource.json

      // If a filterTerm is set, use it to filter results
      const filter = state.ui.filterTerm ? state.ui.filterTerm : false

      // Function to determine which members are selected
      const getMembers = (memberType, memberSubType) => {
        const localMembers = memberSubType ? localsource[memberType][memberSubType] : localsource[memberType]
        return localMembers.reduce((acc, localMember) => {
          let member = Object.assign({}, localMember)
          const customMembers = memberSubType ? customization[memberType][memberSubType] : customization[memberType]
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
          member.visible = true
          member.type = memberType
          member.subType = memberSubType
          acc.push(member)
          return acc
        }, [])
      }

      // Function to filter members based on user input
      const filterMembers = (members) => {
        return members.map(member => {
          if (member.ident.toLowerCase().match(filter.toLowerCase())) {
            member.visible = true
          } else {
            member.visible = false
          }
          return member
        })
      }

      // Get the members, based on visibility
      if (visibleMemberTypes.indexOf('elements') !== -1) {
        elements = getMembers('elements')
      }
      if (visibleMemberTypes.indexOf('attclasses') !== -1) {
        attclasses = getMembers('classes', 'attributes')
      }

      // apply filter
      if (filter) {
        elements = filterMembers(elements)
        attclasses = filterMembers(attclasses)
      }
      // Finally, concat and sort alphabetically
      allMembers = elements.concat(attclasses)
      allMembers.sort((a, b) => {
        if (a.ident.toLowerCase() > b.ident.toLowerCase()) {
          return 1
        } else {
          return (b.ident.toLowerCase() > a.ident.toLowerCase()) ? -1 : 0
        }
      })
    }
  }
  return {members: allMembers, visibleMemberTypes, loadingStatus: state.ui.loadingStatus}
}

const mapDispatchToProps = (dispatch) => {
  return {
    toggleItem: (name, selected) => {
      if (selected) {
        dispatch(excludeElements([name]))
      } else {
        dispatch(includeElements([name]))
      }
    },
    setMemberTypeVisibility: (visibleMemberTypes) => {
      dispatch(setMemberTypeVisibility(visibleMemberTypes))
    },
    clearUiData: () => dispatch(clearUiData())
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MembersList)
