export const UPDATE_ELEMENT_DOCS = 'UPDATE_ELEMENT_DOCS'
export const ELEMENT_ADD_MEMBEROF = 'ELEMENT_ADD_MEMBEROF'
export const ELEMENT_REMOVE_MEMBEROF = 'ELEMENT_REMOVE_MEMBEROF'

// THERE CAN BE MULTIPLE desc and glos ELEMENTS, SO THERE SHOULD BE actions
// FOR ADDING AND REMOVING THEM.

export function updateElementDocs(element, docEl, place, content) {
  // Place can be 'unshift', 'push', or Int.
  return {
    type: UPDATE_ELEMENT_DOCS,
    element,
    docEl,
    place,
    content
  }
}

export function elementAddMemberof(element, className) {
  return {
    type: ELEMENT_ADD_MEMBEROF,
    element,
    className
  }
}

export function elementRemoveMemberof(element, className) {
  return {
    type: ELEMENT_REMOVE_MEMBEROF,
    element,
    className
  }
}
