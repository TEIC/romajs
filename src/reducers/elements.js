import { ReducerException } from '../utils/exceptions'
import { clone } from '../utils/clone'
import {
  DELETE_ELEMENT_DOCS, UPDATE_ELEMENT_DOCS,
  ADD_ELEMENT_MODEL_CLASS, DELETE_ELEMENT_MODEL_CLASS,
  ADD_ELEMENT_ATTRIBUTE_CLASS, DELETE_ELEMENT_ATTRIBUTE_CLASS
} from '../actions/elements'

export function oddElements(state, action) {
  const newState = clone(state)
  const customizationObj = newState.customization
  const customization = customizationObj.json
  switch (action.type) {
    case UPDATE_ELEMENT_DOCS:
      customization.elements.forEach(m => {
        if (m.ident === action.element) {
          if (Array.isArray(m[action.docEl]) && action.index !== undefined) {
            m[action.docEl][action.index] = action.content
          } else {
            throw new ReducerException(`Description element content does not match ${action.content}.`)
          }
        }
      })
      return newState
    case DELETE_ELEMENT_DOCS:
      customization.elements.forEach(m => {
        if (m.ident === action.element) {
          if (Array.isArray(m[action.docEl]) && action.index !== undefined) {
            m[action.docEl].splice(action.index, 1)
          } else {
            throw new ReducerException(`Description element content does not match ${action.content}.`)
          }
        }
      })
      return newState
    case ADD_ELEMENT_MODEL_CLASS:
      customization.elements.forEach(m => {
        if (m.ident === action.element) {
          if (m.classes.model.indexOf(action.className) === -1) {
            m.classes.model.push(action.className)
          }
        }
      })
      return newState
    case DELETE_ELEMENT_MODEL_CLASS:
      customization.elements.forEach(m => {
        if (m.ident === action.element) {
          const idx = m.classes.model.indexOf(action.className)
          if (idx > -1) {
            m.classes.model.splice(idx, 1)
          } else {
            throw new ReducerException(`Could not locate class ${action.className}.`)
          }
        }
      })
      return newState
    case ADD_ELEMENT_ATTRIBUTE_CLASS:
      customization.elements.forEach(m => {
        if (m.ident === action.element) {
          if (m.classes.atts.indexOf(action.className) === -1) {
            m.classes.atts.push(action.className)
          }
        }
      })
      return newState
    case DELETE_ELEMENT_ATTRIBUTE_CLASS:
      customization.elements.forEach(m => {
        if (m.ident === action.element) {
          const idx = m.classes.atts.indexOf(action.className)
          if (idx > -1) {
            m.classes.atts.splice(idx, 1)
          } else {
            throw new ReducerException(`Could not locate class ${action.className}.`)
          }
        }
      })
      return newState
    default:
      return state
  }
}
