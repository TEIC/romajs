import { ReducerException } from '../utils/exceptions'
import {
  UPDATE_ELEMENT_DOCS, ELEMENT_ADD_MEMBEROF, ELEMENT_REMOVE_MEMBEROF
} from '../actions/elements'

export function oddElements(state, action) {
  const customizationObj = Object.assign({}, state.customization)
  const customization = customizationObj.json
  // const localsource = state.localsource.json
  switch (action.type) {
    case UPDATE_ELEMENT_DOCS:
      customization.members.forEach(m => {
        if (m.ident === action.element && m.type === 'elementSpec') {
          if (Array.isArray(m[action.docEl]) && Array.isArray(action.content)) {
            m[action.docEl] = action.content
          } else {
            throw new ReducerException(`Description element content does not match ${action.content}.`)
          }
        }
      })
      return Object.assign(state, {customization: customizationObj})
    case ELEMENT_ADD_MEMBEROF:
    case ELEMENT_REMOVE_MEMBEROF:
    default:
      return state
  }
}
