/* Actions related to the user interface, not ODD */

export const SET_FILTER_TERM = 'SET_FILTER_TERM'
export const ADD_FROM_PICKER = 'ADD_FROM_PICKER'
export const CLEAR_PICKER = 'CLEAR_PICKER'
export const CLEAR_UI_DATA = 'CLEAR_UI_DATA'

export function setFilterTerm(term) {
  return {
    type: SET_FILTER_TERM,
    term
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
