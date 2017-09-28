import { connect } from 'react-redux'
import Element from '../components/Element'
import { push } from 'react-router-redux'

const mapStateToProps = (state, ownProps) => {
  let element = null
  let success = false
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
  return { redirect: () => dispatch(push('/')) }
}

const ElementPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(Element)

export default ElementPage
