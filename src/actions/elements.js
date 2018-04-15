export const UPDATE_ELEMENT_DOCS = 'UPDATE_ELEMENT_DOCS'
export const DELETE_ELEMENT_DOCS = 'DELETE_ELEMENT_DOCS'
export const ADD_ELEMENT_MODEL_CLASS = 'ADD_ELEMENT_MODEL_CLASS'
export const DELETE_ELEMENT_MODEL_CLASS = 'DELETE_ELEMENT_MODEL_CLASS'
export const ADD_ELEMENT_ATTRIBUTE_CLASS = 'ADD_ELEMENT_ATTRIBUTE_CLASS'
export const RESTORE_ELEMENT_ATTRIBUTE_CLASS = 'RESTORE_ELEMENT_ATTRIBUTE_CLASS'
export const DELETE_ELEMENT_ATTRIBUTE_CLASS = 'DELETE_ELEMENT_ATTRIBUTE_CLASS'
export const ADD_ELEMENT_ATTRIBUTE = 'ADD_ELEMENT_ATTRIBUTE' // Creates a new entry in attributes array
export const DELETE_ELEMENT_ATTRIBUTE = 'DELETE_ELEMENT_ATTRIBUTE' // Completely removes entry in `attributes` array
export const RESTORE_CLASS_ATTRIBUTE = 'RESTORE_CLASS_ATTRIBUTE'
export const DELETE_CLASS_ATTRIBUTE = 'DELETE_CLASS_ATTRIBUTE'

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

export function restoreElementAttributeClass(element, className) {
  return {
    type: RESTORE_ELEMENT_ATTRIBUTE_CLASS,
    element,
    className
  }
}

export function restoreClassAttribute(element, attName) {
  return {
    type: RESTORE_CLASS_ATTRIBUTE,
    element,
    attName
  }
}

export function deleteClassAttribute(element, className, attName) {
  return {
    type: DELETE_CLASS_ATTRIBUTE,
    element,
    className,
    attName
  }
}
