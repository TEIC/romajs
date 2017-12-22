import { SET_FILTER_TERM, CLEAR_UI_DATA } from '../actions/interface'

export function ui(state = {}, action) {
  switch (action.type) {
    case SET_FILTER_TERM:
      return Object.assign({}, state,
        {filterTerm: action.term}
      )
    case CLEAR_UI_DATA:
      return Object.assign({})
    default:
      return state
  }
}
