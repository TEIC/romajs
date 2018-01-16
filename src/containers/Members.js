import { connect } from 'react-redux'
import { includeElements, excludeElements } from '../actions/modules'
import MembersList from '../components/MembersList'

const mapStateToProps = (state) => {
  let elements = []
  if (state.odd.customization && state.odd.localsource) {
    if (!state.odd.customization.isFetching && !state.odd.localsource.isFetching) {
      const customization = state.odd.customization.json
      const localsource = state.odd.localsource.json

      // If a filterTerm is set, use it to filter results
      const filter = state.ui.filterTerm ? state.ui.filterTerm : false

      elements = localsource.elements.reduce((acc, localMember) => {
        let element = Object.assign({}, localMember)
        const customMember = customization.elements.filter(m => (m.ident === localMember.ident))[0]
        if (customMember) {
          element = Object.assign({}, customMember)
          element.selected = true
          element.module_selected = true
        } else {
          element.selected = false
          if (customization.modules.filter(m => (m.ident === element.module))[0]) {
            element.module_selected = true
          } else {
            element.module_selected = false
          }
        }
        element.visible = true
        acc.push(element)
        return acc
      }, [])
      // apply filter
      if (filter) {
        elements = elements.map(el => {
          if (el.ident.toLowerCase().match(filter.toLowerCase())) {
            el.visible = true
          } else {
            el.visible = false
          }
          return el
        })
      }
      // Finally, sort alphabetically
      elements.sort((a, b) => {
        if (a.ident.toLowerCase() > b.ident.toLowerCase()) {
          return 1
        } else {
          return (b.ident.toLowerCase() > a.ident.toLowerCase()) ? -1 : 0
        }
      })
    }
  }
  return {elements}
  // else return {elements: [], classes: [], datatypes: [], macros: []}
}

const mapDispatchToProps = (dispatch) => {
  return {
    toggleItem: (name, selected) => {
      if (selected) {
        dispatch(excludeElements([name]))
      } else {
        dispatch(includeElements([name]))
      }
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MembersList)
