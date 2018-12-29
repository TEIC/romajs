import { ReducerException } from '../utils/exceptions'
import { clone } from '../utils/clone'
import {
  DELETE_CLASS_DOCS, UPDATE_CLASS_DOCS, DELETE_CLASS_ATTRIBUTE, RESTORE_CLASS_ATTRIBUTE, ADD_CLASS_ATTRIBUTE,
  ADD_MEMBERSHIP_TO_CLASS
} from '../actions/classes'

// TODO: this function can be shared with elements.js
function markChange(member, whatChanged) {
  if (member._changed) {
    const changes = new Set(member._changed)
    changes.add(whatChanged)
    member._changed = Array.from(changes)
  } else {
    member._changed = [whatChanged]
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
            markChange(m, 'attributes')
          }
        }
      })
      return newState
    case RESTORE_CLASS_ATTRIBUTE:
      allCustomClasses.forEach(m => {
        if (m.ident === action.member) {
          if (m.attributes) {
            m.attributes = m.attributes.map(a => {
              let restoredAtt
              if (a.ident === action.attribute) {
                restoredAtt = clone(a)
                restoredAtt.mode = 'add'
                // Get all others properties from localsource
                allLocalClasses.forEach(el => {
                  if (el.ident === action.element) {
                    if (el.attributes) {
                      const latt = el.attributes.filter(la => la.ident === action.attribute)[0]
                      if (latt) {
                        restoredAtt = clone(latt)
                      }
                    }
                  }
                })
              }
              if (restoredAtt) return restoredAtt
              return a
            })
          }
          markChange(m, 'attributes')
        }
      })
      return newState
    case ADD_CLASS_ATTRIBUTE:
      let newAttribute = {}
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
          ns: 'http://example.com/newNS',
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
          markChange(m, 'attributes')
        }
      })
      return newState
    case ADD_MEMBERSHIP_TO_CLASS:
      allCustomClasses.forEach(m => {
        if (m.ident === action.member) {
          console.log('h')
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
            markChange(m, 'attClasses')
          }
        }
      })
      localClass = localsource.classes.attributes.filter(c => (c.ident === action.className))[0]
      if (customization.classes.attributes.filter(c => (c.ident === action.className)).length === 0) {
        customization.classes.attributes.push(localClass)
      }
      return newState
    default:
      return state
  }
}
