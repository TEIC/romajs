export const UPDATE_ELEMENT_DOCS = 'UPDATE_ELEMENT_DOCS'
export const UPDATE_ELEMENT_MODEL_CLASSES = 'UPDATE_ELEMENT_MODEL_CLASSES'
export const UPDATE_ELEMENT_ATTRIBUTE_CLASSES = 'UPDATE_ELEMENT_ATTRIBUTE_CLASSES'

export function updateElementDocs(element, docEl, content) {
  // content can be string or array depending on element and documentation element (docEl).
  return {
    type: UPDATE_ELEMENT_DOCS,
    element,
    docEl,
    content
  }
}

export function updateElementModelClasses(element, classNames) {
  return {
    type: UPDATE_ELEMENT_MODEL_CLASSES,
    element,
    classNames
  }
}

export function updateElementAttributeClasses(element, classNames) {
  return {
    type: UPDATE_ELEMENT_ATTRIBUTE_CLASSES,
    element,
    classNames
  }
}
