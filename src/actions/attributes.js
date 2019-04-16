export const UPDATE_ATTRIBUTE_DOCS = 'UPDATE_ATTRIBUTE_DOCS'
export const DELETE_ATTRIBUTE_DOCS = 'DELETE_ATTRIBUTE_DOCS'
export const SET_NS = 'SET_NS'
export const SET_USAGE = 'SET_USAGE'
export const SET_DATATYPE = 'SET_DATATYPE'
export const SET_DATATYPE_RESTRICTION = 'SET_DATATYPE_RESTRICTION'
export const SET_VALLIST_TYPE = 'SET_VALLIST_TYPE'
export const ADD_VALITEM = 'ADD_VALITEM'
export const DELETE_VALITEM = 'DELETE_VALITEM'

export function updateAttributeDocs(member, memberType, attr, docEl, content, index, valItem = false) {
  return {
    type: UPDATE_ATTRIBUTE_DOCS,
    member,
    memberType,
    attr,
    docEl,
    content,
    index,
    valItem
  }
}

export function deleteAttributeDocs(member, memberType, attr, docEl, index, valItem = false) {
  return {
    type: DELETE_ATTRIBUTE_DOCS,
    member,
    memberType,
    attr,
    docEl,
    index,
    valItem
  }
}

export function setNs(member, memberType, attr, ns) {
  return {
    type: SET_NS,
    member,
    memberType,
    attr,
    ns
  }
}

export function setUsage(member, memberType, attr, usage) {
  return {
    type: SET_USAGE,
    member,
    memberType,
    attr,
    usage
  }
}

export function setValListType(member, memberType, attr, listType) {
  return {
    type: SET_VALLIST_TYPE,
    member,
    memberType,
    attr,
    listType
  }
}

export function addValItem(member, memberType, attr, value) {
  return {
    type: ADD_VALITEM,
    member,
    memberType,
    attr,
    value
  }
}

export function deleteValItem(member, memberType, attr, value) {
  return {
    type: DELETE_VALITEM,
    member,
    memberType,
    attr,
    value
  }
}

export function setDatatype(member, memberType, attr, datatype) {
  return {
    type: SET_DATATYPE,
    member,
    memberType,
    attr,
    datatype
  }
}

export function setDataTypeRestriction(member, memberType, attr, value) {
  return {
    type: SET_DATATYPE_RESTRICTION,
    member,
    memberType,
    attr,
    value
  }
}
