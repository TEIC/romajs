export const UPDATE_ELEMENT_DOCS = 'UPDATE_ELEMENT_DOCS'
export const DELETE_ELEMENT_DOCS = 'DELETE_ELEMENT_DOCS'
export const ADD_ELEMENT_MODEL_CLASS = 'ADD_ELEMENT_MODEL_CLASS'
export const DELETE_ELEMENT_MODEL_CLASS = 'DELETE_ELEMENT_MODEL_CLASS'
export const ADD_ELEMENT_ATTRIBUTE_CLASS = 'ADD_ELEMENT_ATTRIBUTE_CLASS'
export const DELETE_ELEMENT_ATTRIBUTE_CLASS = 'DELETE_ELEMENT_ATTRIBUTE_CLASS'

export function updateElementDocs(element, docEl, content, index) {
  return {
    type: UPDATE_ELEMENT_DOCS,
    element,
    docEl,
    content,
    index
  }
}

export function deleteElementDocs(element, docEl, index) {
  return {
    type: DELETE_ELEMENT_DOCS,
    element,
    docEl,
    index
  }
}

export function addElementModelClass(element, className) {
  return {
    type: ADD_ELEMENT_MODEL_CLASS,
    element,
    className
  }
}

export function deleteElementModelClass(element, className) {
  return {
    type: DELETE_ELEMENT_MODEL_CLASS,
    element,
    className
  }
}

export function addElementAttributeClass(element, className) {
  return {
    type: ADD_ELEMENT_ATTRIBUTE_CLASS,
    element,
    className
  }
}

export function deleteElementAttributeClass(element, className) {
  return {
    type: DELETE_ELEMENT_ATTRIBUTE_CLASS,
    element,
    className
  }
}
