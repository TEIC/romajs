import { ReducerException } from '../utils/exceptions'
import { clone } from '../utils/clone'
import {
  DELETE_ATTRIBUTE_DOCS, UPDATE_ATTRIBUTE_DOCS, SET_NS, SET_USAGE, SET_VALLIST_TYPE, ADD_VALITEM,
  DELETE_VALITEM,
  SET_DATATYPE,
  SET_DATATYPE_RESTRICTION
} from '../actions/attributes'
import primitiveDatatypes from '../utils/primitiveDatatypes'

function markChange(member) {
  if (member._changed) {
    const changes = new Set(member._changed)
    changes.add('attributes')
    member._changed = Array.from(changes)
  } else {
    member._changed = ['attributes']
  }
}

function markAttChange(attribute, whatChanged) {
  if (attribute._changed) {
    const changes = new Set(attribute._changed)
    changes.add(whatChanged)
    attribute._changed = Array.from(changes)
  } else {
    attribute._changed = [whatChanged]
  }
}

function updateDocEl(m, action) {
  if (m.ident === action.member) {
    markChange(m)
    const att = m.attributes.filter(a => (a.ident === action.attr))[0]
    if (Array.isArray(att[action.docEl]) && action.index !== undefined) {
      att[action.docEl][action.index] = action.content
      markAttChange(att, action.docEl)
    } else {
      throw new ReducerException(`Description element content does not match ${action.content}.`)
    }
  }
}

function delDocEl(m, action) {
  if (m.ident === action.member) {
    markChange(m)
    const att = m.attributes.filter(a => (a.ident === action.attr))[0]
    if (Array.isArray(att[action.docEl]) && action.index !== undefined) {
      att[action.docEl].splice(action.index, 1)
      markAttChange(att, action.docEl)
    } else {
      throw new ReducerException(`Description element content does not match ${action.content}.`)
    }
  }
}

function setNs(m, action) {
  if (m.ident === action.member) {
    markChange(m)
    const att = m.attributes.filter(a => (a.ident === action.attr))[0]
    att.ns = action.ns
    markAttChange(att, 'ns')
  }
}

function setUsage(m, action) {
  if (m.ident === action.member) {
    markChange(m)
    const att = m.attributes.filter(a => (a.ident === action.attr))[0]
    att.usage = action.usage
    markAttChange(att, 'usage')
  }
}

function setDatatype(m, datatype, action) {
  if (m.ident === action.member) {
    markChange(m)
    const att = m.attributes.filter(a => (a.ident === action.attr))[0]
    if (datatype.type === 'primitive') {
      att.datatype.dataRef.name = datatype.ident
      delete att.datatype.dataRef.key
      delete att.datatype.dataRef.ref
    } else {
      att.datatype.dataRef.key = datatype.ident
      delete att.datatype.dataRef.name
      delete att.datatype.dataRef.ref
    }
    markAttChange(att, 'datatype')
  }
}

function setDatatypeRestriction(m, action) {
  if (m.ident === action.member) {
    markChange(m)
    const att = m.attributes.filter(a => (a.ident === action.attr))[0]
    att.datatype.dataRef.restriction = action.value
    markAttChange(att, 'datatype')
  }
}

function setValListType(m, action) {
  if (m.ident === action.member) {
    markChange(m)
    const att = m.attributes.filter(a => (a.ident === action.attr))[0]
    if (att.valList) {
      att.valList.type = action.listType
    } else {
      att.valList = {type: action.listType}
    }
    markAttChange(att, 'valList')
  }
}

function addValItem(m, action) {
  if (m.ident === action.member) {
    markChange(m)
    const att = m.attributes.filter(a => (a.ident === action.attr))[0]
    if (att.valList) {
      if (att.valList.valItem) {
        const isDefined = att.valList.valItem.filter(v => v.ident === action.value)[0]
        if (!isDefined) {
          att.valList.valItem.push({ident: action.value.replace(/\s+/, '')})
        }
      }
    } else {
      att.valList = {valItem: [{ident: action.value.replace(/\s+/, '')}]}
    }
    markAttChange(att, 'valList')
  }
}

function deleteValItem(m, action) {
  if (m.ident === action.member) {
    markChange(m)
    const att = m.attributes.filter(a => (a.ident === action.attr))[0]
    if (att.valList) {
      if (att.valList.valItem) {
        att.valList.valItem = att.valList.valItem.filter(vi => vi.ident !== action.value)
      }
    }
    markAttChange(att, 'valList')
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
          break
        case 'class':
          customization.classes.attributes.forEach(m => updateDocEl(m, action))
          break
        default:
      }
      return newState
    case DELETE_ATTRIBUTE_DOCS:
      switch (action.memberType) {
        case 'element':
          customization.elements.forEach(m => delDocEl(m, action))
          break
        case 'class':
          customization.classes.attributes.forEach(m => delDocEl(m, action))
          break
        default:
      }
      return newState
    case SET_NS:
      switch (action.memberType) {
        case 'element':
          customization.elements.forEach(m => setNs(m, action))
          break
        case 'class':
          customization.classes.attributes.forEach(m => setNs(m, action))
          break
        default:
      }
      return newState
    case SET_USAGE:
      switch (action.memberType) {
        case 'element':
          customization.elements.forEach(m => setUsage(m, action))
          break
        case 'class':
          customization.classes.attributes.forEach(m => setUsage(m, action))
          break
        default:
      }
      return newState
    case SET_VALLIST_TYPE:
      switch (action.memberType) {
        case 'element':
          customization.elements.forEach(m => setValListType(m, action))
          break
        case 'class':
          customization.classes.attributes.forEach(m => setValListType(m, action))
          break
        default:
      }
      return newState
    case ADD_VALITEM:
      switch (action.memberType) {
        case 'element':
          customization.elements.forEach(m => addValItem(m, action))
          break
        case 'class':
          customization.classes.attributes.forEach(m => addValItem(m, action))
          break
        default:
      }
      return newState
    case DELETE_VALITEM:
      switch (action.memberType) {
        case 'element':
          customization.elements.forEach(m => deleteValItem(m, action))
          break
        case 'class':
          customization.classes.attributes.forEach(m => deleteValItem(m, action))
          break
        default:
      }
      return newState
    case SET_DATATYPE:
      const allDtypes = customization.datatypes.concat(primitiveDatatypes)
      const datatype = allDtypes.filter(dt => dt.ident === action.datatype)[0]
      switch (action.memberType) {
        case 'element':
          customization.elements.forEach(m => setDatatype(m, datatype, action))
          break
        case 'class':
          customization.classes.attributes.forEach(m => setDatatype(m, datatype, action))
          break
        default:
      }
      return newState
    case SET_DATATYPE_RESTRICTION:
      switch (action.memberType) {
        case 'element':
          customization.elements.forEach(m => setDatatypeRestriction(m, action))
          break
        case 'class':
          customization.classes.attributes.forEach(m => setDatatypeRestriction(m, action))
          break
        default:
      }
      return newState
    default:
      return state
  }
}
