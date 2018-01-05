export const UPDATE_ELEMENT_DOCS = 'UPDATE_ELEMENT_DOCS'
export const ELEMENT_ADD_MEMBEROF = 'ELEMENT_ADD_MEMBEROF'
export const ELEMENT_REMOVE_MEMBEROF = 'ELEMENT_REMOVE_MEMBEROF'

export function updateElementDocs(element, docEl, content) {
  // content can be string or array depending on element and documentation element (docEl).
  return {
    type: UPDATE_ELEMENT_DOCS,
    element,
    docEl,
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
