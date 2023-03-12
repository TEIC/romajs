import { ReducerException } from '../utils/exceptions'
import { clone } from '../utils/clone'
import {
  DELETE_ELEMENT_DOCS, UPDATE_ELEMENT_DOCS,
  ADD_ELEMENT_MODEL_CLASS, DELETE_ELEMENT_MODEL_CLASS,
  ADD_ELEMENT_ATTRIBUTE, DELETE_ELEMENT_ATTRIBUTE, RESTORE_ELEMENT_ATTRIBUTE,
  ADD_ELEMENT_ATTRIBUTE_CLASS, RESTORE_ELEMENT_ATTRIBUTE_CLASS, DELETE_ELEMENT_ATTRIBUTE_CLASS,
  RESTORE_CLASS_ATTRIBUTE_ON_ELEMENT, RESTORE_CLASS_ATTRIBUTE_DELETED_ON_CLASS,
  USE_CLASS_DEFAULT, DELETE_CLASS_ATTRIBUTE_ON_ELEMENT, CHANGE_CLASS_ATTRIBUTE_ON_ELEMENT, CHANGE_ELEMENT_ATTRIBUTE,
  UPDATE_CONTENT_MODEL,
  RESTORE_ELEMENT_MEMBERSHIPS_TO_CLASS,
  CLEAR_ELEMENT_MEMBERSHIPS_TO_CLASS,
  CREATE_NEW_ELEMENT,
  DISCARD_ELEMENT_CHANGES,
  REVERT_ELEMENT_TO_SOURCE
} from '../actions/elements'

function deleteAttribute(m, attribute) {
  const newAtt = clone(attribute)
  newAtt.mode = 'delete'
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

function restoreClassAttributeDeletedOnClass(element, className, attName, localsource, customization) {
  const localClass = localsource.classes.attributes.filter(c => (c.ident === className))[0]
  const attribute = localClass.attributes.filter(a => a.ident === attName)[0]
  customization.elements.forEach(m => {
    if (m.ident === element) {
      m.attributes.push(Object.assign({}, attribute, {
        mode: 'change',
        _changed: false,
        inheritedFrom: className
      }))
    }
  })
}

function markChange(element, whatChanged) {
  if (element._changed) {
    const changes = new Set(element._changed)
    changes.add(whatChanged)
    element._changed = Array.from(changes)
  } else {
    element._changed = [whatChanged]
  }
}

export function oddElements(state, action) {
  const newState = clone(state)
  const customizationObj = newState.customization
  const customization = customizationObj.json
  const localsourceObj = newState.localsource
  const localsource = localsourceObj.json

  function addClass(m, className, classType) {
    const type = classType === 'atts' ? 'attributes' : 'models'
    const hasClass = (member, cn) => {
      // This function checks against inherited classes
      if (member.classes) {
        if (member.classes[classType].filter(cl => (cl === cn))[0]) {
          return true
        } else {
          for (const cl of member.classes[classType]) {
            const subClass = customization.classes[type].filter(c => (c.ident === cl))[0]
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
    // Make sure the requested class is not already selected or inherited
    if (!hasClass(m, className)) {
      if (!m.classes) m.classes = []
      m.classes[classType].push(className)
      markChange(m, classType)
    }
  }

  switch (action.type) {
    case UPDATE_ELEMENT_DOCS:
      customization.elements.forEach(m => {
        if (m.ident === action.element) {
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
    case DELETE_ELEMENT_DOCS:
      const localEl = localsource.elements.filter(e => action.element === e.ident)[0]
      customization.elements.forEach(m => {
        if (m.ident === action.element) {
          if (Array.isArray(m[action.docEl]) && action.index !== undefined) {
            if (action.index + 1 <= localEl[action.docEl].length) {
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
    case ADD_ELEMENT_MODEL_CLASS:
      customization.elements.forEach(m => {
        if (m.ident === action.element) {
          if (m.classes.model.filter(c => (c === action.className)).length === 0) {
            m.classes.model.push(action.className)
            markChange(m, 'modelClasses')
          }
        }
      })
      return newState
    case DELETE_ELEMENT_MODEL_CLASS:
      customization.elements.forEach(m => {
        if (m.ident === action.element) {
          m.classes.model = m.classes.model.filter(c => (c !== action.className))
          markChange(m, 'modelClasses')
        }
      })
      return newState
    case ADD_ELEMENT_ATTRIBUTE:
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
      customization.elements.forEach(m => {
        if (m.ident === action.element) {
          if (!m.attributes) {
            m.attributes = [newAttribute]
          } else {
            m.attributes.push(newAttribute)
          }
          markChange(m, 'attributes')
        }
      })
      return newState
    case DELETE_ELEMENT_ATTRIBUTE:
      customization.elements.forEach(m => {
        if (m.ident === action.element) {
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
    case RESTORE_ELEMENT_ATTRIBUTE:
      customization.elements.forEach(m => {
        if (m.ident === action.element) {
          if (m.attributes) {
            m.attributes = m.attributes.map(a => {
              let restoredAtt
              if (a.ident === action.attribute) {
                restoredAtt = clone(a)
                restoredAtt.mode = 'add'
                // Get all others properties from localsource
                localsource.elements.forEach(el => {
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
                  if (subClass) {
                    if (hasClass(subClass, className)) {
                      return true
                    }
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
      let localClass = localsource.classes.attributes.filter(c => (c.ident === action.className))[0]
      if (customization.classes.attributes.filter(c => (c.ident === action.className)).length === 0) {
        customization.classes.attributes.push(localClass)
      }
      return newState
    case RESTORE_ELEMENT_ATTRIBUTE_CLASS:
      customization.elements.forEach(m => {
        if (m.ident === action.element) {
          let cl = customization.classes.attributes.filter(c => (c.ident === action.className))[0]
          if (cl) {
            cl.attributes.map(a => {
              m.attributes = m.attributes.filter(attEl => (attEl.ident !== a.ident))
            })
          } else {
            // It must be inherited, so get it from the localsource
            cl = localsource.classes.attributes.filter(c => (c.ident === action.className))[0]
            m.attributes = Array.from(cl.attributes)
          }
          // If there are deleted attributes on the class, they need to be marked as changed
          if (action.deletedAttributes.length > 0) {
            for (const attName of action.deletedAttributes) {
              restoreClassAttributeDeletedOnClass(action.element, action.className, attName, localsource, customization)
            }
          }
          markChange(m, 'attributes')
        }
      })
      return newState
    case DELETE_ELEMENT_ATTRIBUTE_CLASS:
      customization.elements.forEach(m => {
        if (m.ident === action.element) {
          const idx = m.classes.atts.indexOf(action.className)
          // If the element is a member of the class
          if (idx > -1) {
            // Remove membership to this class
            m.classes.atts.splice(idx, 1)
            // Also remove all attributes from this class that have been redefined
            const lClass = localsource.classes.attributes.filter(c => {
              return c.ident === action.className
            })[0]
            if (m.attributes) {
              m.attributes = m.attributes.filter(att => {
                if (lClass.attributes.filter(la => {
                  return la.ident === att.ident
                }).length === 0) {
                  return true
                }
                return false
              })
            }
            markChange(m, 'attClasses')
          } else {
            // The class must be inherited, so remove all the attributes instead
            const customClass = customization.classes.attributes.filter(c => (c.ident === action.className))[0]
            if (customClass) {
              for (const clAtt of customClass.attributes) {
                deleteAttribute(m, clAtt)
              }
            } else {
              // The class must be inherited, but currently not present in the customization
              // This may happen the a module has recently been added by the user,
              // or via adding an element from a previously unselected module.
              const lClass = localsource.classes.attributes.filter(c => (c.ident === action.className))[0]
              if (lClass) {
                for (const clAtt of lClass.attributes) {
                  deleteAttribute(m, clAtt)
                }
              } else {
                throw new ReducerException(`Could not locate class ${action.className}.`)
              }
            }
            markChange(m, 'attributes')
          }
        }
      })
      // TODO: If this class is not used anywhere else, it *could* be removed from the customization subtree...
      // localsource.classes.attributes = localsource.classes.attributes.filter(c => (c.ident !== action.className))
      return newState
    case RESTORE_CLASS_ATTRIBUTE_ON_ELEMENT:
      customization.elements.forEach(m => {
        if (m.ident === action.element) {
          m.attributes = m.attributes.filter(a => {
            return (a.ident !== action.attName)
          })
        }
      })
      return newState
    case RESTORE_CLASS_ATTRIBUTE_DELETED_ON_CLASS:
      // get it from the localsource because this attribute has been deleted from the customized class
      restoreClassAttributeDeletedOnClass(action.element, action.className, action.attName, localsource, customization)
      return newState
    case USE_CLASS_DEFAULT:
      customization.elements.forEach(m => {
        if (m.ident === action.element) {
          m.attributes = m.attributes.filter(a => {
            return (a.ident !== action.attName)
          })
        }
      })
      return newState
    case DELETE_CLASS_ATTRIBUTE_ON_ELEMENT:
      let customClass = customization.classes.attributes.filter(c => (c.ident === action.className))[0]
      let attribute
      if (customClass) {
        attribute = customClass.attributes.filter(a => a.ident === action.attName)[0]
      } else {
        localClass = localsource.classes.attributes.filter(c => (c.ident === action.className))[0]
        attribute = localClass.attributes.filter(a => a.ident === action.attName)[0]
      }
      customization.elements.forEach(m => {
        if (m.ident === action.element) {
          deleteAttribute(m, attribute)
          markChange(m, 'attributes')
        }
      })
      return newState
    case CHANGE_CLASS_ATTRIBUTE_ON_ELEMENT:
      customClass = customization.classes.attributes.filter(c => (c.ident === action.className))[0]
      let attributeToChange
      if (customClass) {
        attributeToChange = customClass.attributes.filter(a => a.ident === action.attName)[0]
      }

      if (!customClass | !attributeToChange) {
        localClass = localsource.classes.attributes.filter(c => (c.ident === action.className))[0]
        attributeToChange = localClass.attributes.filter(a => a.ident === action.attName)[0]
      }
      customization.elements.forEach(m => {
        if (m.ident === action.element) {
          const newAtt = Object.assign({}, attributeToChange, {mode: 'change', changed: false, _fromClass: action.className})
          if (!m.attributes) {
            m.attributes = [newAtt]
          } else {
            let found = false
            m.attributes.forEach(att => {
              if (att.ident === attributeToChange.ident) {
                found = true
                att.mode = 'change'
                att._fromClass = action.className
              }
            })
            if (!found) {
              m.attributes.push(newAtt)
            }
          }
        }
      })
      return newState
    case CHANGE_ELEMENT_ATTRIBUTE:
      customization.elements.forEach(m => {
        if (m.ident === action.element) {
          let newAtt
          let localAtt
          const lEl = localsource.elements.filter((e) => action.element === e.ident)[0]
          if (lEl) {
            localAtt = lEl.attributes
              .filter((a) => action.attName === a.ident)[0]
            newAtt = Object.assign({}, localAtt, {mode: 'change', changed: false, _changedOnMember: true})
          } else {
            newAtt = {mode: 'add', _isNew: true}
          }
          let found = false
          if (m.attributes) {
            m.attributes.forEach(att => {
              if (att.ident === action.attName) {
                found = true
                // If this element is not defined on localsource, the mode needs to stay 'add'
                // In all other cases we need to signal a change from the localsource
                if (localAtt) att.mode = 'change'
                att._changedOnMember = true
              }
            })
            if (!found) {
              m.attributes.push(newAtt)
            }
          } else {
            m.attributes = [newAtt]
          }
          markChange(m, 'attributes')
        }
      })
      return newState
    case UPDATE_CONTENT_MODEL:
      // no-op
      customization.elements.forEach(m => {
        if (m.ident === action.element) {
          // TODO: this may be made safer without stringify
          m.content = JSON.parse(JSON.stringify(action.content).replace(/Infinity/g, 'unbounded'))
          markChange(m, 'content')
        }
      })
      return newState
    case RESTORE_ELEMENT_MEMBERSHIPS_TO_CLASS:
      // Locate all elements that are member of the requested class.
      // Restore membership if missing
      for (const locEl of localsource.elements) {
        if (locEl.classes) {
          const type = action.classType === 'attributes' ? 'atts' : 'model'
          const isMember = locEl.classes[type].filter(c => c === action.className)[0]
          if (isMember) {
            const customEl = customization.elements.filter(el => (el.ident === locEl.ident))[0]
            if (customEl) {
              addClass(customEl, action.className, type)
            }
          }
        }
      }
      return newState
    case CLEAR_ELEMENT_MEMBERSHIPS_TO_CLASS:
      // Locate all elements that are member of the requested class.
      // remove membership to that class
      for (const locEl of localsource.elements) {
        if (locEl.classes) {
          const type = action.classType === 'attributes' ? 'atts' : 'model'
          const isMember = locEl.classes[type].filter(c => c === action.className)[0]
          if (isMember) {
            const customEl = customization.elements.filter(el => (el.ident === locEl.ident))[0]
            if (customEl && customEl.classes) {
              customEl.classes[type] = customEl.classes[type].filter(c => (c !== action.className))
            }
          }
        }
      }
      return newState
    case CREATE_NEW_ELEMENT:
      const newElement = {
        ident: action.name,
        type: 'elementSpec',
        module: action.module,
        desc: [],
        shortDesc: '',
        gloss: [],
        altIdent: [],
        classes: {
          model: [],
          atts: []
        },
        attributes: [],
        content: [],
        ns: action.ns,
        _isNew: true
      }
      customization.elements.push(newElement)
      return newState
    case DISCARD_ELEMENT_CHANGES:
      customization.elements = customization.elements.reduce((acc, m) => {
        if (m.ident === action.name) {
          const origEl = customizationObj.orig.elements.filter(el => el.ident === action.name)[0]
          if (origEl) {
            acc.push(clone(origEl))
          }
        } else {
          acc.push(m)
        }
        return acc
      }, [])
      return newState
    case REVERT_ELEMENT_TO_SOURCE:
      customization.elements = customization.elements.reduce((acc, m) => {
        if (m.ident === action.name) {
          const lEl = localsource.elements.filter(el => el.ident === action.name)[0]
          if (lEl) {
            acc.push(clone(lEl))
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
