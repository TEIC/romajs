import { ReducerException } from '../utils/exceptions'
import { clone } from '../utils/clone'
import { UPDATE_DATATYPE_DOCS, DELETE_DATATYPE_DOCS, CREATE_NEW_DATATYPE,
  DISCARD_DATATYPE_CHANGES, REVERT_DATATYPE_TO_SOURCE, SET_DATAREF,
  SET_DATAREF_RESTRICTION, NEW_DATAREF, NEW_TEXTNODE, DELETE_DATATYPE_CONTENT,
  MOVE_DATATYPE_CONTENT, NEW_DATATYPE_VALLIST, ADD_DATATYPE_VALITEM,
  DELETE_DATATYPE_VALITEM, SET_DATATYPE_CONTENT_GROUPING} from '../actions/datatypes'
import primitiveDatatypes from '../utils/primitiveDatatypes'

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
        content: [],
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
    case SET_DATAREF:
      const allDtypes = customization.datatypes.concat(primitiveDatatypes)
      const setDataRef = (dataRef) => {
        const datatype = allDtypes.filter(dt => dt.ident === action.keyOrName)[0]
        if (datatype.type === 'primitive') {
          dataRef.name = datatype.ident
          delete dataRef.key
          delete dataRef.ref
        } else {
          dataRef.key = datatype.ident
          delete dataRef.name
          delete dataRef.ref
        }
      }
      customization.datatypes.forEach(dt => {
        if (dt.ident === action.datatype) {
          if (dt.content.type === 'alternate' || dt.content[0].type === 'sequence') {
            setDataRef(dt.content[0].content[action.index])
          } else {
            setDataRef(dt.content[action.index])
          }
          markChange(dt, 'content')
        }
      })
      return newState
    case SET_DATAREF_RESTRICTION:
      const applyRestriction = (dataRef) => {
        if (dataRef.key === action.keyOrName) {
          dataRef.restriction = action.value
        } else if (dataRef.name === action.keyOrName) {
          dataRef.restriction = action.value
        } else {
          // Something's not right.
          throw new ReducerException(`Could not add restriction to datatype.`)
        }
      }
      customization.datatypes.forEach(dt => {
        if (dt.ident === action.datatype) {
          if (dt.content[0].type === 'alternate' || dt.content[0].type === 'sequence') {
            applyRestriction(dt.content[0].content[action.index])
          } else {
            applyRestriction(dt.content[action.index])
          }
          markChange(dt, 'content')
        }
      })
      return newState
    case NEW_DATAREF:
      const newDataRef = {
        type: 'dataRef',
        name: 'string'
      }
      customization.datatypes.forEach(dt => {
        if (dt.ident === action.datatype) {
          if (dt.content[0] && (dt.content.type === 'alternate' || dt.content[0].type === 'sequence')) {
            dt.content[0].content.push(newDataRef)
          } else {
            dt.content.push(newDataRef)
          }
          markChange(dt, 'content')
        }
      })
      return newState
    case NEW_TEXTNODE:
      const newTextNode = {
        type: 'textNode'
      }
      customization.datatypes.forEach(dt => {
        if (dt.ident === action.datatype) {
          if (dt.content[0].type === 'alternate' || dt.content[0].type === 'sequence') {
            dt.content[0].content.push(newTextNode)
          } else {
            dt.content.push(newTextNode)
          }
          markChange(dt, 'content')
        }
      })
      return newState
    case NEW_DATATYPE_VALLIST:
      const newValList = {
        type: 'valList'
      }
      customization.datatypes.forEach(dt => {
        if (dt.ident === action.datatype) {
          if (dt.content[0].type === 'alternate' || dt.content[0].type === 'sequence') {
            dt.content[0].content.push(newValList)
          } else {
            dt.content.push(newValList)
          }
          markChange(dt, 'content')
        }
      })
      return newState
    case ADD_DATATYPE_VALITEM:
      const addValItem = (vi) => {
        if (Array.isArray(vi)) {
          const newVi = Array.from(vi)
          newVi.push({
            ident: action.value
          })
          return newVi
        }
        return [{
          ident: action.value
        }]
      }
      customization.datatypes.forEach(dt => {
        if (dt.ident === action.datatype) {
          if (dt.content[0].type === 'alternate' || dt.content[0].type === 'sequence') {
            dt.content[0].content[action.index].valItem = addValItem(dt.content[0].content[action.index].valItem)
          } else {
            dt.content[action.index].valItem = addValItem(dt.content[action.index].valItem)
          }
        }
      })
      return newState
    case DELETE_DATATYPE_VALITEM:
      customization.datatypes.forEach(dt => {
        if (dt.ident === action.datatype) {
          if (dt.content[0].type === 'alternate' || dt.content[0].type === 'sequence') {
            dt.content[0].content[action.index].valItem = dt.content[0].content[action.index].valItem.reduce((acc, vi) => {
              if (vi.ident !== action.value) {
                acc.push(vi)
              }
              return acc
            }, [])
          } else {
            dt.content[action.index].valItem = dt.content[action.index].valItem.reduce((acc, vi) => {
              if (vi.ident !== action.value) {
                acc.push(vi)
              }
              return acc
            }, [])
          }
          markChange(dt, 'content')
        }
      })
      return newState
    case DELETE_DATATYPE_CONTENT:
      customization.datatypes.forEach(dt => {
        if (dt.ident === action.datatype) {
          if (dt.content[0].type === 'alternate' || dt.content[0].type === 'sequence') {
            dt.content[0].content.splice(action.index, 1)
          } else {
            dt.content.splice(action.index, 1)
          }
          markChange(dt, 'content')
        }
      })
      return newState
    case MOVE_DATATYPE_CONTENT:
      if (action.indexFrom >= 0 && action.indexTo >= 0) {
        customization.datatypes.forEach(dt => {
          if (dt.ident === action.datatype) {
            if (dt.content[0].type === 'alternate' || dt.content[0].type === 'sequence') {
              if (action.indexTo < dt.content[0].content.length) {
                const item = dt.content[0].content[action.indexFrom]
                dt.content[0].content.splice(action.indexFrom, 1)
                dt.content[0].content.splice(action.indexTo, 0, item)
              }
            } else {
              if (action.indexTo < dt.content.length) {
                const item = dt.content[action.indexFrom]
                dt.content.splice(action.indexFrom, 1)
                dt.content.splice(action.indexTo, 0, item)
              }
            }
            markChange(dt, 'content')
          }
        })
        return newState
      }
      return state
    case SET_DATATYPE_CONTENT_GROUPING:
      customization.datatypes.forEach(dt => {
        if (dt.ident === action.datatype) {
          switch (dt.content[0].type) {
            case 'alternate':
            case 'sequence':
              if (action.groupingType === 'unordered') {
                // remove grouping
                dt.content = dt.content[0].content
              } else {
                dt.content[0].type = action.groupingType
              }
              break
            default:
              if (action.groupingType !== 'unordered') {
                // add grouping
                dt.content = [{
                  type: action.groupingType,
                  content: dt.content
                }]
              }
          }
          markChange(dt, 'content')
        }
      })
      return newState
    default:
      return state
  }
}
