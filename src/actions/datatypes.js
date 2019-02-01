export const UPDATE_DATATYPE_DOCS = 'UPDATE_DATATYPE_DOCS'
export const DELETE_DATATYPE_DOCS = 'DELETE_DATATYPE_DOCS'
export const CREATE_NEW_DATATYPE = 'CREATE_NEW_DATATYPE'
export const DISCARD_DATATYPE_CHANGES = 'DISCARD_DATATYPE_CHANGES'
export const REVERT_DATATYPE_TO_SOURCE = 'REVERT_DATATYPE_TO_SOURCE'

export function updateDatatypeDocs(member, docEl, content, index) {
  return {
    type: UPDATE_DATATYPE_DOCS,
    member,
    docEl,
    content,
    index
  }
}

export function deleteDatatypeDocs(member, docEl, index) {
  return {
    type: DELETE_DATATYPE_DOCS,
    member,
    docEl,
    index
  }
}

export function createNewDatatype(name, module) {
  return {
    type: CREATE_NEW_DATATYPE,
    name,
    module
  }
}

export function discardChanges(name) {
  return {
    type: DISCARD_DATATYPE_CHANGES,
    name
  }
}

export function revertToSource(name) {
  return {
    type: REVERT_DATATYPE_TO_SOURCE,
    name
  }
}
