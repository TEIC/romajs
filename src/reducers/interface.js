import { SET_FILTER_TERM, CLEAR_UI_DATA, ADD_FROM_PICKER, CLEAR_PICKER, SET_LOADING_STATUS, SET_LANGUAGE,
  SET_MEMBERTYPE_VISIBILITY, SORT_MEMBERS_BY, SET_FILTER_OPTIONS, SET_VALID
} from '../actions/interface'

const initialState = {
  language: 'en',
  isOddValid: true
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
    case SET_FILTER_OPTIONS:
      return Object.assign({}, state,
        {filterOptions: Object.assign({}, state.filterOptions || {}, action.options)})
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
      return Object.assign({}, initialState, {
        language: state.language
      })
    case SET_LANGUAGE:
      return Object.assign({}, state,
        {language: action.language}
      )
    case SET_MEMBERTYPE_VISIBILITY:
      return Object.assign({}, state,
        {visibleMemberTypes: action.visibleMemberTypes})
    case SORT_MEMBERS_BY:
      return Object.assign({}, state,
        {sortMembersBy: action.mode})
    case SET_VALID:
      return Object.assign({}, state,
        {isOddValid: action.valid})
    default:
      return state
  }
}
