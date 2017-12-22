/* Actions related to the user interface, not ODD */

export const SET_FILTER_TERM = 'SET_FILTER_TERM'
export const CLEAR_UI_DATA = 'CLEAR_UI_DATA'

export function setFilterTerm(term) {
  return {
    type: SET_FILTER_TERM,
    term
  }
}

export function clearUiData() {
  return {
    type: CLEAR_UI_DATA
  }
}
