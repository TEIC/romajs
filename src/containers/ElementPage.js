import { connect } from 'react-redux'
import Element from '../components/Element'
import { push } from 'react-router-redux'
import { updateElementDocs } from '../actions/elements'

const mapStateToProps = (state, ownProps) => {
  let element = null
  let success = false
  // TODO: Also don't set success to true if the element hasn't been selected
  if (state.odd.customization && state.odd.localsource) {
    if (!state.odd.customization.isFetching && !state.odd.localsource.isFetching) {
      const customEl = state.odd.customization.json.members.filter(x => {
        return (x.ident === ownProps.match.params.el && x.type === 'elementSpec')
      })[0]
      if (!customEl) {
        const localEl = state.odd.localsource.json.members.filter(x => {
          return (x.ident === ownProps.match.params.el && x.type === 'elementSpec')
        })[0]
        if (localEl) {
          element = localEl
          success = true
        }
      } else {
        element = customEl
        success = true
      }
    }
  }
  return {element, success}
}

const mapDispatchToProps = (dispatch) => {
  return {
    navigateTo: (place) => dispatch(push(place)),
    updateElementDocs: (element, docEl, content) => dispatch(updateElementDocs(element, docEl, content))
  }
}

const ElementPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(Element)

export default ElementPage
