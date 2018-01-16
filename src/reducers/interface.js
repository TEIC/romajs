import { SET_FILTER_TERM, CLEAR_UI_DATA, ADD_FROM_PICKER, CLEAR_PICKER } from '../actions/interface'

export function ui(state = {}, action) {
  switch (action.type) {
    case SET_FILTER_TERM:
      return Object.assign({}, state,
        {filterTerm: action.term}
      )
    case ADD_FROM_PICKER:
      return Object.assign({}, state,
        {pickerItem: {type: action.pickerType, item: action.item}}
      )
    case CLEAR_PICKER:
      return Object.assign({}, state,
        {pickerItem: null}
      )
    case CLEAR_UI_DATA:
      return Object.assign({})
    default:
      return state
  }
}
