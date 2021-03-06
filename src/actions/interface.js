/* Actions related to the user interface, not ODD */

export const SET_FILTER_TERM = 'SET_FILTER_TERM'
export const SET_FILTER_OPTIONS = 'SET_FILTER_OPTIONS'
export const SET_MEMBERTYPE_VISIBILITY = 'SET_MEMBERTYPE_VISIBILITY'
export const ADD_FROM_PICKER = 'ADD_FROM_PICKER'
export const CLEAR_PICKER = 'CLEAR_PICKER'
export const CLEAR_UI_DATA = 'CLEAR_UI_DATA'
export const SET_LOADING_STATUS = 'SET_LOADING_STATUS'
export const SET_LANGUAGE = 'SET_LANGUAGE'
export const SORT_MEMBERS_BY = 'SORT_MEMBERS_BY'
export const SET_VALID = 'SET_VALID'

export function setFilterTerm(term) {
  return {
    type: SET_FILTER_TERM,
    term
  }
}

export function setMemberTypeVisibility(visibleMemberTypes) {
  return {
    type: SET_MEMBERTYPE_VISIBILITY,
    visibleMemberTypes
  }
}

export function setLoadingStatus(msg) {
  return {
    type: SET_LOADING_STATUS,
    msg
  }
}

export function addFromPicker(pickerType, item) {
  return {
    type: ADD_FROM_PICKER,
    pickerType,
    item
  }
}

export function clearPicker() {
  return {
    type: CLEAR_PICKER
  }
}

export function clearUiData() {
  return {
    type: CLEAR_UI_DATA
  }
}

export function setLanguage(language) {
  return {
    type: SET_LANGUAGE,
    language
  }
}

export function sortMembersBy(mode) {
  return {
    type: SORT_MEMBERS_BY,
    mode
  }
}

export function setFilterOptions(options) {
  return {
    type: SET_FILTER_OPTIONS,
    options
  }
}

export function setValid(valid) {
  return {
    type: SET_VALID,
    valid
  }
}
