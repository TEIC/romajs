export const UPDATE_CLASS_DOCS = 'UPDATE_CLASS_DOCS'
export const DELETE_CLASS_DOCS = 'DELETE_CLASS_DOCS'
export const DELETE_CLASS_ATTRIBUTE = 'DELETE_CLASS_ATTRIBUTE'
export const RESTORE_CLASS_ATTRIBUTE = 'RESTORE_CLASS_ATTRIBUTE'
export const ADD_CLASS_ATTRIBUTE = 'ADD_CLASS_ATTRIBUTE'
export const ADD_MEMBERSHIP_TO_CLASS = 'ADD_MEMBERSHIP_TO_CLASS'
export const REMOVE_MEMBERSHIP_TO_CLASS = 'REMOVE_MEMBERSHIP_TO_CLASS'
export const CHANGE_CLASS_ATTRIBUTE = 'CHANGE_CLASS_ATTRIBUTE'

export function updateClassDocs(member, docEl, content, index) {
  return {
    type: UPDATE_CLASS_DOCS,
    member,
    docEl,
    content,
    index
  }
}

export function deleteClassDocs(member, docEl, index) {
  return {
    type: DELETE_CLASS_DOCS,
    member,
    docEl,
    index
  }
}

export function deleteClassAttribute(member, attribute) {
  return {
    type: DELETE_CLASS_ATTRIBUTE,
    member,
    attribute
  }
}

export function restoreClassAttribute(member, attribute) {
  return {
    type: RESTORE_CLASS_ATTRIBUTE,
    member,
    attribute
  }
}

export function addClassAttribute(member, attribute) {
  return {
    type: ADD_CLASS_ATTRIBUTE,
    member,
    attribute
  }
}

export function addMembershipToClass(member, className, classType) {
  return {
    type: ADD_MEMBERSHIP_TO_CLASS,
    member,
    className,
    classType
  }
}

export function removeMembershipToClass(member, className, classType) {
  return {
    type: REMOVE_MEMBERSHIP_TO_CLASS,
    member,
    className,
    classType
  }
}

export function changeClassAttribute(className, attName) {
  return {
    type: CHANGE_CLASS_ATTRIBUTE,
    className,
    attName
  }
}
