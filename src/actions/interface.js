/* Actions related to the user interface, not ODD */

export const SET_FILTER_TERM = 'SET_FILTER_TERM'

export function setFilterTerm(term) {
  return {
    type: SET_FILTER_TERM,
    term
  }
}
