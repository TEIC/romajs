import {
  INCLUDE_MODULES, EXCLUDE_MODULES, INCLUDE_ELEMENTS, EXCLUDE_ELEMENTS, INCLUDE_CLASSES, EXCLUDE_CLASSES, INCLUDE_DATATYPES, EXCLUDE_DATATYPES
} from '../actions/modules'
import { clone } from '../utils/clone'
import { isMemberExplicitlyDeleted } from './odd/utils'

class ODDCache {
  // A Cache for a parsed ODD document that gets instanced if any of these reducers need to
  // look at the ODD XML specifically.
  setParser() {
    this.parser = new DOMParser()
  }

  parseODD(odd) {
    this.stringOdd = odd
    this.odd = this.parser.parseFromString(odd, 'text/xml')
    if (global.usejsdom) {
      // replace DOM with JSDOM
      this.odd = global.usejsdom(this.odd)
    }
  }

  setup(odd) {
    // parse odd if necessary
    if (!this.odd || this.stringOdd !== odd) {
      if (!this.parser) {
        this.setParser()
      }
      this.parseODD(odd)
    }
  }
}

const oddCache = new ODDCache()

function getElementByIdent(source, ident) {
  return source.elements.filter(m => { return m.ident === ident })[0]
}

function getClassByIdent(source, ident, type) {
  return source.classes[type].filter(m => { return m.ident === ident })[0]
}

function getDatatypeByIdent(source, ident) {
  return source.datatypes.filter(m => { return m.ident === ident })[0]
}

export function oddModules(state, action) {
  const customizationObj = Object.assign({}, state.customization)
  const customization = customizationObj.json
  const localsource = state.localsource.json
  const currentModules = customization.modules.reduce((acc, m) => {
    acc.push(m.ident)
    return acc
  }, [])
  switch (action.type) {
    case INCLUDE_MODULES:
      const modulesToInclude = action.modules.filter(x => (currentModules.indexOf(x) === -1))
      for (const ident of modulesToInclude) {
        const localMod = localsource.modules.filter(x => (x.ident === ident))[0]
        customization.modules.push({
          ident,
          id: localMod.id,
          desc: localMod.desc
        })
        // Include all elements, classes, and datatypes from this module
        for (const m of localsource.elements) {
          if (m.module === ident) {
            // if not in custom, add.
            if (!customization.elements.filter(x => (x.ident === m.ident))[0]) {
              customization.elements.push(m)
            }
          }
        }
        for (const m of localsource.classes.attributes) {
          if (m.module === ident) {
            // if not in custom, add.
            if (!customization.classes.attributes.filter(x => (x.ident === m.ident))[0]) {
              customization.classes.attributes.push(m)
            }
          }
        }
        for (const m of localsource.classes.models) {
          if (m.module === ident) {
            // if not in custom, add.
            if (!customization.classes.models.filter(x => (x.ident === m.ident))[0]) {
              customization.classes.models.push(m)
            }
          }
        }
        for (const m of localsource.datatypes) {
          if (m.module === ident) {
            // if not in custom, add.
            if (!customization.datatypes.filter(x => (x.ident === m.ident))[0]) {
              customization.datatypes.push(m)
            }
          }
        }
      }
      return Object.assign(state, {customization: customizationObj})
    case EXCLUDE_MODULES:
      customization.modules = customization.modules.filter(m => {
        return (action.modules.indexOf(m.ident) === -1)
      })
      // Exclude all elements, classes, and datatypes from this module
      customization.elements = customization.elements.filter(m => {
        return action.modules.indexOf(m.module) === -1
      })
      customization.classes.attributes = customization.classes.attributes.filter(m => {
        return action.modules.indexOf(m.module) === -1
      })
      customization.classes.models = customization.classes.models.filter(m => {
        return action.modules.indexOf(m.module) === -1
      })
      customization.datatypes = customization.datatypes.filter(m => {
        return action.modules.indexOf(m.module) === -1
      })
      return Object.assign(state, {customization: customizationObj})
    case INCLUDE_ELEMENTS:
      for (const el of action.elements) {
        const localEl = getElementByIdent(localsource, el)
        const newEl = clone(localEl)
        newEl._changed = ['all']
        // Make sure to add only references to classes that are not explicitly removed
        // Need to look at XML ODD because some classes may have been orphaned
        // and ZAPped (dropped) during ODD compilation.
        if (newEl.classes) {
          oddCache.setup(state.customization.xml)
          newEl.classes.atts = newEl.classes.atts.reduce((acc, cl) => {
            const localCl = localsource.classes.attributes.filter(ccl => (cl === ccl.ident))[0]
            if (!isMemberExplicitlyDeleted(oddCache.odd, localCl.ident, 'class', localCl.module)) {
              acc.push(cl)
            }
            return acc
          }, [])
          newEl.classes.model = newEl.classes.model.reduce((acc, cl) => {
            const localCl = localsource.classes.models.filter(ccl => (cl === ccl.ident))[0]
            if (!isMemberExplicitlyDeleted(oddCache.odd, localCl.ident, 'class', localCl.module)) {
              acc.push(cl)
            }
            return acc
          }, [])
        }
        if (!getElementByIdent(customization, el)) {
          customization.elements.push(newEl)
        }
        // If the module for the added element was not selected, do it now.
        if (customization.modules.filter(x => (x.ident === localEl.module)).length === 0) {
          const localMod = localsource.modules.filter(x => (x.ident === localEl.module))[0]
          customization.modules.push(localMod)
        }
      }
      return Object.assign(state, {customization: customizationObj})
    case EXCLUDE_ELEMENTS:
      for (const el of action.elements) {
        const localEl = getElementByIdent(localsource, el)
        customization.elements = customization.elements.reduce((acc, m) => {
          if (m.ident !== el) {
            acc.push(m)
          }
          return acc
        }, [])
        // If there are no more elements belonging to the module, remove it
        const moduleElements = customization.elements.filter(x => {
          return x.module === localEl.module
        })
        if (moduleElements.length === 0) {
          customization.modules = customization.modules.reduce((acc, m) => {
            if (m.ident !== localEl.module) {
              acc.push(m)
            }
            return acc
          }, [])
        }
      }
      return Object.assign(state, {customization: customizationObj})
    case INCLUDE_CLASSES:
      for (const cl of action.classes) {
        const localCl = getClassByIdent(localsource, cl, action.classType)
        const newCl = clone(localCl)
        newCl._changed = ['all']
        if (!getClassByIdent(customization, cl, action.classType)) {
          newCl.cloned = true
          customization.classes[action.classType].push(newCl)
        }
        // Make sure only references to classes that are not explicitly removed
        // Need to look at XML ODD because some classes may have been orphaned
        // and ZAPped (dropped) during ODD compilation.
        if (newCl.classes) {
          oddCache.setup(state.customization.xml)
          newCl.classes.atts = newCl.classes.atts.reduce((acc, lcl) => {
            const lCl = localsource.classes.attributes.filter(ccl => (lcl === ccl.ident))[0]
            if (!isMemberExplicitlyDeleted(oddCache.odd, lCl.ident, 'class', lCl.module)) {
              acc.push(cl)
            }
            return acc
          }, [])
          newCl.classes.model = newCl.classes.model.reduce((acc, lcl) => {
            const lCl = localsource.classes.models.filter(ccl => (lcl === ccl.ident))[0]
            if (!isMemberExplicitlyDeleted(oddCache.odd, lCl.ident, 'class', lCl.module)) {
              acc.push(cl)
            }
            return acc
          }, [])
        }
        // remove from list of deleted classes
        if (Array.isArray(customization.classes._deleted)) {
          customization.classes._deleted = customization.classes._deleted.filter(c => c !== cl)
        }
      }
      return Object.assign(state, {customization: customizationObj})
    case EXCLUDE_CLASSES:
      for (const cl of action.classes) {
        customization.classes[action.classType] = customization.classes[action.classType].reduce((acc, m) => {
          if (m.ident !== cl) {
            acc.push(m)
          }
          return acc
        }, [])
        if (Array.isArray(customization.classes._deleted)) {
          customization.classes._deleted.push(cl)
        } else {
          customization.classes._deleted = [cl]
        }
      }
      return Object.assign(state, {customization: customizationObj})
    case INCLUDE_DATATYPES:
      for (const dt of action.datatypes) {
        const localDt = getDatatypeByIdent(localsource, dt)
        const newDt = clone(localDt)
        newDt._changed = ['all']
        if (!getDatatypeByIdent(customization, dt)) {
          customization.datatypes.push(newDt)
        }
        if (Array.isArray(customization._deleteddatatypes)) {
          customization._deleteddatatypes = customization._deleteddatatypes.filter(ddt => ddt !== dt)
        }
      }
      return Object.assign(state, {customization: customizationObj})
    case EXCLUDE_DATATYPES:
      for (const dt of action.datatypes) {
        customization.datatypes = customization.datatypes.reduce((acc, m) => {
          if (m.ident !== dt) {
            acc.push(m)
          }
          return acc
        }, [])
        if (Array.isArray(customization._deleteddatatypes)) {
          customization._deleteddatatypes.push(dt)
        } else {
          customization._deleteddatatypes = [dt]
        }
      }
      return Object.assign(state, {customization: customizationObj})
    default:
      return state
  }
}
