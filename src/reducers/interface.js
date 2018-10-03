import { SET_FILTER_TERM, CLEAR_UI_DATA, ADD_FROM_PICKER, CLEAR_PICKER, SET_LOADING_STATUS, SET_LANGUAGE } from '../actions/interface'

const initialState = {
  language: 'en'
}

export function ui(state = initialState, action) {
  switch (action.type) {
    case SET_LOADING_STATUS:
      return Object.assign({}, state,
        {loadingStatus: action.msg}
      )
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
      // Clear everything except language
      return {
        language: state.language
      }
    case SET_LANGUAGE:
      return Object.assign({}, state,
        {language: action.language}
      )
    default:
      return state
  }
}
