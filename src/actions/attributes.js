export const UPDATE_ATTRIBUTE_DOCS = 'UPDATE_ATTRIBUTE_DOCS'
export const DELETE_ATTRIBUTE_DOCS = 'DELETE_ATTRIBUTE_DOCS'
export const SET_NS = 'SET_NS'
export const SET_USAGE = 'SET_USAGE'
export const SET_DATATYPE = 'SET_DATATYPE'

export function updateAttributeDocs(member, memberType, attr, docEl, content, index) {
  return {
    type: UPDATE_ATTRIBUTE_DOCS,
    member,
    memberType,
    attr,
    docEl,
    content,
    index
  }
}

export function deleteAttributeDocs(member, memberType, attr, docEl, index) {
  return {
    type: DELETE_ATTRIBUTE_DOCS,
    member,
    memberType,
    attr,
    docEl,
    index
  }
}
