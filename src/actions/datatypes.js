export const UPDATE_DATATYPE_DOCS = 'UPDATE_DATATYPE_DOCS'
export const DELETE_DATATYPE_DOCS = 'DELETE_DATATYPE_DOCS'
export const CREATE_NEW_DATATYPE = 'CREATE_NEW_DATATYPE'
export const DISCARD_DATATYPE_CHANGES = 'DISCARD_DATATYPE_CHANGES'
export const REVERT_DATATYPE_TO_SOURCE = 'REVERT_DATATYPE_TO_SOURCE'
export const SET_DATAREF = 'SET_DATAREF'
export const SET_DATAREF_RESTRICTION = 'SET_DATAREF_RESTRICTION'
export const NEW_DATAREF = 'NEW_DATAREF'
export const NEW_TEXTNODE = 'NEW_TEXTNODE'
export const NEW_DATATYPE_VALLIST = 'NEW_DATATYPE_VALLIST'
export const ADD_DATATYPE_VALITEM = 'ADD_DATATYPE_VALITEM'
export const DELETE_DATATYPE_VALITEM = 'DELETE_DATATYPE_VALITEM'
export const DELETE_DATATYPE_CONTENT = 'DELETE_DATATYPE_CONTENT'
export const MOVE_DATATYPE_CONTENT = 'MOVE_DATATYPE_CONTENT'
export const SET_DATATYPE_CONTENT_GROUPING = 'SET_DATATYPE_CONTENT_GROUPING'

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

export function setDataRef(datatype, keyOrName, index) {
  return {
    type: SET_DATAREF,
    datatype,
    keyOrName,
    index
  }
}

export function setDataRefRestriction(datatype, keyOrName, value, index) {
  return {
    type: SET_DATAREF_RESTRICTION,
    datatype,
    keyOrName,
    value,
    index
  }
}

export function newDataRef(datatype) {
  return {
    type: NEW_DATAREF,
    datatype
  }
}

export function newDatatypeValList(datatype) {
  return {
    type: NEW_DATATYPE_VALLIST,
    datatype
  }
}

export function addDatatypeValItem(datatype, index, value) {
  return {
    type: ADD_DATATYPE_VALITEM,
    datatype,
    index,
    value
  }
}

export function deleteDatatypeValItem(datatype, index, value) {
  return {
    type: DELETE_DATATYPE_VALITEM,
    datatype,
    index,
    value
  }
}

export function deleteDatatypeContent(datatype, index) {
  return {
    type: DELETE_DATATYPE_CONTENT,
    datatype,
    index
  }
}

export function moveDatatypeContent(datatype, indexFrom, indexTo) {
  return {
    type: MOVE_DATATYPE_CONTENT,
    datatype,
    indexFrom,
    indexTo
  }
}

export function newTextNode(datatype) {
  return {
    type: NEW_TEXTNODE,
    datatype
  }
}

export function setDatatypeContentGrouping(datatype, groupingType) {
  return {
    type: SET_DATATYPE_CONTENT_GROUPING,
    datatype,
    groupingType
  }
}
