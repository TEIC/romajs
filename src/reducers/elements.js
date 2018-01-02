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
          if (action.place === 'unshift') {
            m[action.docEl].unshift(action.content)
          } else if (action.place === 'push') {
            m[action.docEl].push(action.content)
          } else {
            m[action.docEl][action.place] = action.content
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
