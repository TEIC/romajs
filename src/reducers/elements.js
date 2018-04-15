import { ReducerException } from '../utils/exceptions'
import { clone } from '../utils/clone'
import {
  DELETE_ELEMENT_DOCS, UPDATE_ELEMENT_DOCS,
  ADD_ELEMENT_MODEL_CLASS, DELETE_ELEMENT_MODEL_CLASS,
  ADD_ELEMENT_ATTRIBUTE_CLASS, RESTORE_ELEMENT_ATTRIBUTE_CLASS, DELETE_ELEMENT_ATTRIBUTE_CLASS,
  RESTORE_CLASS_ATTRIBUTE, DELETE_CLASS_ATTRIBUTE
} from '../actions/elements'

function deleteAttribute(m, attribute) {
  const newAtt = Object.assign({}, attribute, {mode: 'delete'})
  if (!m.attributes) {
    m.attributes = [newAtt]
  } else {
    let found = false
    m.attributes.forEach(att => {
      if (att.ident === attribute.ident) {
        found = true
        att.mode = 'delete'
      }
    })
    if (!found) {
      m.attributes.push(newAtt)
    }
  }
}

export function oddElements(state, action) {
  const newState = clone(state)
  const customizationObj = newState.customization
  const customization = customizationObj.json
  const localsourceObj = newState.localsource
  const localsource = localsourceObj.json
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
          const hasClass = (member, className) => {
            // This function checks against inherited classes
            if (member.classes) {
              if (member.classes.atts.filter(cl => (cl === className))[0]) {
                return true
              } else {
                for (const cl of member.classes.atts) {
                  const subClass = customization.classes.attributes.filter(c => (c.ident === cl))[0]
                  if (hasClass(subClass, className)) {
                    return true
                  }
                }
                return false
              }
            } else {
              return false
            }
          }
          // Make sure the request class is not already selected or inherited
          if (!hasClass(m, action.className)) {
            m.classes.atts.push(action.className)
          }
        }
      })
      const localClass = localsource.classes.attributes.filter(c => (c.ident === action.className))[0]
      if (customization.classes.attributes.filter(c => (c.ident === action.className)).length === 0) {
        customization.classes.attributes.push(localClass)
      }
      return newState
    case RESTORE_ELEMENT_ATTRIBUTE_CLASS:
      customization.elements.forEach(m => {
        if (m.ident === action.element) {
          const cl = customization.classes.attributes.filter(c => (c.ident === action.className))[0]
          cl.attributes.map(a => {
            m.attributes = m.attributes.filter(attEl => (attEl.ident !== a.ident))
          })
        }
      })
      return newState
    case DELETE_ELEMENT_ATTRIBUTE_CLASS:
      let customClass = customization.classes.attributes.filter(c => (c.ident === action.className))[0]
      customization.elements.forEach(m => {
        if (m.ident === action.element) {
          const idx = m.classes.atts.indexOf(action.className)
          if (idx > -1) {
            m.classes.atts.splice(idx, 1)
          } else if (customClass) {
            // The class must be inherited, so remove all the attributes instead
            for (const clAtt of customClass.attributes) {
              deleteAttribute(m, clAtt)
            }
          } else {
            throw new ReducerException(`Could not locate class ${action.className}.`)
          }
        }
      })
      // TODO: If this class is not used anywhere else, it *could* be removed from the customization...
      // localsource.classes.attributes = localsource.classes.attributes.filter(c => (c.ident !== action.className))
      return newState
    case RESTORE_CLASS_ATTRIBUTE:
      customization.elements.forEach(m => {
        if (m.ident === action.element) {
          m.attributes = m.attributes.filter(a => {
            return (a.ident !== action.attName && a.mode === 'delete')
          })
        }
      })
      return newState
    case DELETE_CLASS_ATTRIBUTE:
      customClass = customization.classes.attributes.filter(c => (c.ident === action.className))[0]
      const attribute = customClass.attributes.filter(a => a.ident === action.attName)[0]
      customization.elements.forEach(m => {
        if (m.ident === action.element) {
          deleteAttribute(m, attribute)
        }
      })
      return newState
    default:
      return state
  }
}
