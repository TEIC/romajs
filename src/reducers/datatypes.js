import { ReducerException } from '../utils/exceptions'
import { clone } from '../utils/clone'
import { UPDATE_DATATYPE_DOCS, DELETE_DATATYPE_DOCS, CREATE_NEW_DATATYPE, DISCARD_DATATYPE_CHANGES, REVERT_DATATYPE_TO_SOURCE } from '../actions/datatypes'

// TODO: this function can be shared with elements.js, etc.
function markChange(member, whatChanged) {
  if (member._changed) {
    const changes = new Set(member._changed)
    changes.add(whatChanged)
    member._changed = Array.from(changes)
  } else {
    member._changed = [whatChanged]
  }
}

export function oddDatatypes(state, action) {
  const newState = clone(state)
  const customizationObj = newState.customization
  const customization = customizationObj.json
  const localsourceObj = newState.localsource
  const localsource = localsourceObj.json

  switch (action.type) {
    case UPDATE_DATATYPE_DOCS:
      customization.datatypes.forEach(m => {
        if (m.ident === action.member) {
          if (Array.isArray(m[action.docEl]) && action.index !== undefined) {
            m[action.docEl][action.index] = action.content
            m.mode = 'change'
            markChange(m, action.docEl)
          } else {
            throw new ReducerException(`Description element content does not match ${action.content}.`)
          }
        }
      })
      return newState
    case DELETE_DATATYPE_DOCS:
      const localDt = localsource.datatypes.filter(m => action.member === m.ident)[0]
      customization.datatypes.forEach(m => {
        if (m.ident === action.member) {
          if (Array.isArray(m[action.docEl]) && action.index !== undefined) {
            if (action.index + 1 <= localDt[action.docEl].length) {
              // This is an already defined documentation element,
              // so keep a place holder since our operations are based on position.
              m[action.docEl].splice(action.index, 1, {deleted: true})
            } else {
              // New documentation element, simply get rid of it.
              m[action.docEl].splice(action.index, 1)
            }
          } else {
            throw new ReducerException(`Description element content does not match ${action.content}.`)
          }
        }
      })
      return newState
    case CREATE_NEW_DATATYPE:
      const newDatatype = {
        ident: action.name,
        module: action.module,
        desc: [],
        shortDesc: '',
        gloss: [],
        altIdent: [],
        _isNew: true
      }
      customization.datatypes.push(newDatatype)
      return newState
    case DISCARD_DATATYPE_CHANGES:
      customization.datatypes = customization.datatypes.reduce((acc, m) => {
        if (m.ident === action.name) {
          const origDt = customizationObj.orig.datatypes.filter(dt => dt.ident === action.name)[0]
          if (origDt) {
            acc.push(clone(origDt))
          }
        } else {
          acc.push(m)
        }
        return acc
      }, [])
      return newState
    case REVERT_DATATYPE_TO_SOURCE:
      customization.datatypes = customization.datatypes.reduce((acc, m) => {
        if (m.ident === action.name) {
          const lDt = localsource.datatypes.filter(dt => dt.ident === action.name)[0]
          if (lDt) {
            acc.push(clone(lDt))
          }
        } else {
          acc.push(m)
        }
        return acc
      }, [])
      return newState
    default:
      return state
  }
}
