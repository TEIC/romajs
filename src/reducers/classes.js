import { ReducerException } from '../utils/exceptions'
import { clone } from '../utils/clone'
import {
  DELETE_CLASS_DOCS, UPDATE_CLASS_DOCS, DELETE_CLASS_ATTRIBUTE, RESTORE_CLASS_ATTRIBUTE, ADD_CLASS_ATTRIBUTE,
  ADD_MEMBERSHIP_TO_CLASS, REMOVE_MEMBERSHIP_TO_CLASS, CHANGE_CLASS_ATTRIBUTE, RESTORE_MEMBERSHIPS_TO_CLASS,
  CLEAR_MEMBERSHIPS_TO_CLASS,
  CREATE_NEW_CLASS,
  DISCARD_CLASS_CHANGES,
  REVERT_CLASS_TO_SOURCE
} from '../actions/classes'

// TODO: this function can be shared with elements.js
function markChange(member, whatChanged) {
  let wc = whatChanged
  if (whatChanged === 'atts') {
    wc = 'attributes'
  } else if (whatChanged === 'model') {
    wc = 'models'
  }
  if (member._changed) {
    const changes = new Set(member._changed)
    changes.add(wc)
    member._changed = Array.from(changes)
  } else {
    member._changed = [wc]
  }
}

export function oddClasses(state, action) {
  const newState = clone(state)
  const customizationObj = newState.customization
  const customization = customizationObj.json
  const localsourceObj = newState.localsource
  const localsource = localsourceObj.json

  const allCustomClasses = customization.classes.attributes.concat(customization.classes.models)
  const allLocalClasses = localsource.classes.attributes.concat(localsource.classes.models)

  function addClass(m, className, classType) {
    const hasClass = (member, cn) => {
      // This function checks against inherited classes
      if (member.classes) {
        if (member.classes[classType].filter(cl => (cl === cn))[0]) {
          return true
        } else {
          for (const cl of member.classes[classType]) {
            const subClass = allCustomClasses.filter(c => (c.ident === cl))[0]
            if (subClass) {
              if (hasClass(subClass, cn)) {
                return true
              }
            } else continue
          }
          return false
        }
      } else {
        return false
      }
    }
    // Make sure the request class is not already selected or inherited
    if (!hasClass(m, className)) {
      if (!m.classes) m.classes = []
      m.classes[classType].push(className)
      markChange(m, classType)
    }
  }

  switch (action.type) {
    case UPDATE_CLASS_DOCS:
      allCustomClasses.forEach(m => {
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
    case DELETE_CLASS_DOCS:
      let localClass = allLocalClasses.filter(m => action.member === m.ident)[0]
      allCustomClasses.forEach(m => {
        if (m.ident === action.member) {
          if (Array.isArray(m[action.docEl]) && action.index !== undefined) {
            if (action.index + 1 <= localClass[action.docEl].length) {
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
    case DELETE_CLASS_ATTRIBUTE:
      allCustomClasses.forEach(m => {
        if (m.ident === action.member) {
          if (m.attributes) {
            m.attributes = m.attributes.reduce((acc, a) => {
              if (a.ident === action.attribute) {
                if (!a._isNew) {
                  a.mode = 'delete'
                  acc.push(a)
                }
              } else {
                acc.push(a)
              }
              return acc
            }, [])
            markChange(m, 'classAtts')
          }
        }
      })
      return newState
    case RESTORE_CLASS_ATTRIBUTE:
      localClass = allLocalClasses.filter(m => action.member === m.ident)[0]
      const latt = localClass.attributes.filter(la => la.ident === action.attribute)[0]
      const restoredAtt = clone(latt)
      restoredAtt._changed = ['all']
      allCustomClasses.forEach(m => {
        if (m.ident === action.member) {
          if (m.attributes) {
            // remove deleted attribute if it's still there
            m.attributes = m.attributes.filter(a => a.ident !== action.attribute)
            m.attributes.push(restoredAtt)
          } else {
            m.attributes = [restoredAtt]
          }
          markChange(m, 'classAtts')
        }
      })
      return newState
    case ADD_CLASS_ATTRIBUTE:
      let newAttribute = {}
      let ns = ''
      if (customizationObj.settings) {
        if (customizationObj.settings.nsToAtts) {
          if (customizationObj.settings.namespace) {
            ns = customizationObj.settings.namespace
          }
        }
      }
      if (typeof action.attribute === 'string') {
        newAttribute = {
          ident: action.attribute,
          desc: [],
          gloss: [],
          altIdent: [],
          datatype: {
            dataRef: {
              name: 'string',
              dataFacet: []
            }
          },
          valDesc: [],
          mode: 'add',
          ns,
          usage: '',
          _isNew: true
        }
      } else {
        newAttribute = clone(action.attribute)
        newAttribute._isNew = true
        if (!newAttribute.valDesc) {
          newAttribute.valDesc = []
        }
        if (!newAttribute.altIdent) {
          newAttribute.altIdent = []
        }
      }
      allCustomClasses.forEach(m => {
        if (m.ident === action.member) {
          if (!m.attributes) {
            m.attributes = [newAttribute]
          } else {
            m.attributes.push(newAttribute)
          }
          markChange(m, 'classAtts')
        }
      })
      return newState
    case ADD_MEMBERSHIP_TO_CLASS:
      allCustomClasses.forEach(m => {
        if (m.ident === action.member) {
          addClass(m, action.className, action.classType)
        }
      })
      const classesType = action.classType === 'atts' ? 'attributes' : 'models'
      localClass = localsource.classes[classesType].filter(c => (c.ident === action.className))[0]
      if (customization.classes[classesType].filter(c => (c.ident === action.className)).length === 0) {
        customization.classes[classesType].push(localClass)
      }
      return newState
    case REMOVE_MEMBERSHIP_TO_CLASS:
      allCustomClasses.forEach(m => {
        if (m.ident === action.member) {
          m.classes[action.classType] = m.classes[action.classType].filter(cl => (cl !== action.className))
          const type = action.classType === 'atts' ? 'attributes' : 'models'
          markChange(m, type)
        }
      })
      return newState
    case CHANGE_CLASS_ATTRIBUTE:
      let customClass = customization.classes.attributes.filter(c => (c.ident === action.className))[0]
      customClass.attributes = customClass.attributes.map(a => {
        if (a.ident === action.attName) {
          return Object.assign({}, a, {mode: 'change', changed: false, _changedOnMember: true})
        } else {
          return a
        }
      })
      markChange(customClass, 'classAtts')
      return newState
    case RESTORE_MEMBERSHIPS_TO_CLASS:
      // Locate all classes that are member of the requested class.
      // Restore membership if missing
      for (localClass of allLocalClasses) {
        if (localClass.classes) {
          const type = action.classType === 'attributes' ? 'atts' : 'model'
          const isMember = localClass.classes[type].filter(c => c === action.className)[0]
          if (isMember) {
            customClass = allCustomClasses.filter(c => (c.ident === localClass.ident))[0]
            if (customClass) {
              addClass(customClass, action.className, type)
            }
          }
        }
      }
      return newState
    case CLEAR_MEMBERSHIPS_TO_CLASS:
      // Locate all classes that are member of the requested class.
      // remove membership to that class
      for (localClass of allLocalClasses) {
        if (localClass.classes) {
          const type = action.classType === 'attributes' ? 'atts' : 'model'
          const isMember = localClass.classes[type].filter(c => c === action.className)[0]
          if (isMember) {
            customClass = allCustomClasses.filter(c => (c.ident === localClass.ident))[0]
            if (customClass && customClass.classes) {
              customClass.classes[type] = customClass.classes[type].filter(c => (c !== action.className))
            }
          }
        }
      }
      return newState
    case CREATE_NEW_CLASS:
      const newClass = {
        ident: action.name,
        type: 'classSpec',
        module: action.module,
        desc: [],
        shortDesc: '',
        gloss: [],
        altIdent: [],
        classes: {
          model: [],
          atts: [],
          unknown: []
        },
        _isNew: true
      }
      if (action.classType === 'attributes') {
        newClass.attributes = []
      }
      customization.classes[action.classType].push(newClass)
      return newState
    case DISCARD_CLASS_CHANGES:
      customization.classes[action.classType] = customization.classes[action.classType].reduce((acc, m) => {
        if (m.ident === action.name) {
          const origCl = customizationObj.orig.classes[action.classType].filter(cl => cl.ident === action.name)[0]
          if (origCl) {
            acc.push(clone(origCl))
          }
        } else {
          acc.push(m)
        }
        return acc
      }, [])
      return newState
    case REVERT_CLASS_TO_SOURCE:
      customization.classes[action.classType] = customization.classes[action.classType].reduce((acc, m) => {
        if (m.ident === action.name) {
          const lCl = localsource.classes[action.classType].filter(cl => cl.ident === action.name)[0]
          if (lCl) {
            const clonedLCl = clone(lCl)
            clonedLCl._changed = ['all']
            clonedLCl._revert = true
            acc.push(clonedLCl)
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
