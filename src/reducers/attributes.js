import { ReducerException } from '../utils/exceptions'
import { clone } from '../utils/clone'
import {
  DELETE_ATTRIBUTE_DOCS, UPDATE_ATTRIBUTE_DOCS
} from '../actions/attributes'

function updateDocEl(m, action) {
  if (m.ident === action.member) {
    if (m.attributes) {
      for (const att of m.attributes) {
        if (Array.isArray(att[action.docEl]) && action.index !== undefined) {
          att[action.docEl][action.index] = action.content
        } else {
          throw new ReducerException(`Description element content does not match ${action.content}.`)
        }
      }
    }
  }
}

export function oddAttributes(state, action) {
  const newState = clone(state)
  const customizationObj = newState.customization
  const customization = customizationObj.json
  switch (action.type) {
    case UPDATE_ATTRIBUTE_DOCS:
      switch (action.memberType) {
        case 'element':
          customization.elements.forEach(m => updateDocEl(m, action))
        case 'class':
          customization.classes.forEach(m => updateDocEl(m, action))
        default:
      }
      return newState
    case DELETE_ATTRIBUTE_DOCS:
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
    default:
      return state
  }
}
