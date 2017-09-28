import { SET_FILTER_TERM } from '../actions/interface'

export function ui(state = {}, action) {
  switch (action.type) {
    case SET_FILTER_TERM:
      return Object.assign({}, state,
        {filterTerm: action.term}
      )
    default:
      return state
  }
}
