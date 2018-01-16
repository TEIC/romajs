import { ReducerException } from '../utils/exceptions'
import {
  UPDATE_ELEMENT_DOCS, UPDATE_ELEMENT_MODEL_CLASSES, UPDATE_ELEMENT_ATTRIBUTE_CLASSES
} from '../actions/elements'

export function oddElements(state, action) {
  const customizationObj = Object.assign({}, state.customization)
  const customization = customizationObj.json
  // const localsource = state.localsource.json
  switch (action.type) {
    case UPDATE_ELEMENT_DOCS:
      customization.elements.forEach(m => {
        if (m.ident === action.element) {
          if (Array.isArray(m[action.docEl]) && Array.isArray(action.content)) {
            m[action.docEl] = action.content
          } else {
            throw new ReducerException(`Description element content does not match ${action.content}.`)
          }
        }
      })
      return Object.assign(state, {customization: customizationObj})
    case UPDATE_ELEMENT_MODEL_CLASSES:
      customization.elements.forEach(m => {
        if (m.ident === action.element) {
          m.classes.model = action.classNames
        }
      })
      return Object.assign(state, {customization: customizationObj})
    case UPDATE_ELEMENT_ATTRIBUTE_CLASSES:
      customization.elements.forEach(m => {
        if (m.ident === action.element) {
          m.classes.atts = action.classNames
        }
      })
      return Object.assign(state, {customization: customizationObj})
    default:
      return state
  }
}
