import {
  INCLUDE_MODULES, EXCLUDE_MODULES, INCLUDE_ELEMENTS, EXCLUDE_ELEMENTS
} from '../actions/modules'

function getElementByIdent(source, ident) {
  return source.members.filter(m => {
    return m.type === 'elementSpec' && m.ident === ident
  })[0]
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
        // Include all elements from this module
        for (const m of localsource.members) {
          if (m.type === 'elementSpec' && m.module === ident) {
            // if not in custom, add.
            if (!customization.members.filter(x => (x.ident === m.ident))[0]) {
              customization.members.push(m)
            }
          }
        }
      }
      return Object.assign(state, {customization: customizationObj})
    case EXCLUDE_MODULES:
      customization.modules = customization.modules.filter(m => {
        return (action.modules.indexOf(m.ident) === -1)
      })
      // Exclude all elements from this module
      customization.members = customization.members.filter(m => {
        return action.modules.indexOf(m.module) === -1
      })
      return Object.assign(state, {customization: customizationObj})
    case INCLUDE_ELEMENTS:
      for (const el of action.elements) {
        const localEl = getElementByIdent(localsource, el)
        if (!getElementByIdent(customization, el)) {
          customization.members.push(localEl)
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
        customization.members = customization.members.reduce((acc, m) => {
          if (m.ident !== el) {
            acc.push(m)
          }
          return acc
        }, [])
        // If there are no more elements belonging to the module, remove it
        const moduleElements = customization.members.filter(x => {
          return x.type === 'elementSpec' && x.module === localEl.module
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
    default:
      return state
  }
}
