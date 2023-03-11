import { processDocEls, createDocEls } from './processDocEls'
import { processClassMemberships, createClassMemberships } from './processClassMemberships'
import { processAttributes, createAttributes } from './processAttributes'
import safeSelect from '../../utils/safeSelect'

function getOrSetClassSpec(classType, odd, ident) {
  const type = classType === 'attributes' ? 'atts' : 'model'
  let clSpec = safeSelect(odd.querySelectorAll(`classSpec[ident='${ident}']`))[0]
  if (!clSpec) {
    clSpec = odd.createElementNS('http://www.tei-c.org/ns/1.0', 'classSpec')
    clSpec.setAttribute('ident', ident)
    clSpec.setAttribute('type', type)
    clSpec.setAttribute('mode', 'change')
    const schemaSpec = safeSelect(odd.querySelectorAll('schemaSpec'))[0]
    schemaSpec.appendChild(clSpec)
  }
  return clSpec
}

function processClasses(classType, localsource, customization, odd) {
  for (const cl of customization.classes[classType]) {
    const localCl = localsource.classes[classType].filter(lc => lc.ident === cl.ident)[0]
    let isModuleSelected = true
    if (localCl) {
      isModuleSelected = customization.modules.filter(x => x.ident === localCl.module).length > 0
    }
    if (cl._isNew) {
      // Create new spec
      const type = classType === 'attributes' ? 'atts' : 'model'
      const clSpec = odd.createElementNS('http://www.tei-c.org/ns/1.0', 'classSpec')
      clSpec.setAttribute('ident', cl.ident)
      clSpec.setAttribute('type', type)
      clSpec.setAttribute('mode', 'add')

      // Create documentation elements
      createDocEls(clSpec, cl, odd)

      // Create class memberships
      createClassMemberships(clSpec, cl, odd)

      // Create attributes (when classType === 'attributes')
      if (classType === 'attributes') {
        createAttributes(clSpec, cl, odd)
      }

      const schemaSpec = safeSelect(odd.querySelectorAll('schemaSpec'))[0]
      schemaSpec.appendChild(clSpec)
    } else if (cl._changed && (cl._changed.join('') !== 'included') && isModuleSelected) {
      let changes = cl._changed
      if (cl._changed.indexOf('all') !== -1) {
        changes = ['desc', 'altIdent', 'attributes', 'models']
      }
      const clSpec = getOrSetClassSpec(classType, odd, cl.ident)
      for (const whatChanged of changes) {
        switch (whatChanged) {
          case 'desc':
          case 'altIdent':
            processDocEls(
              clSpec, cl, localCl,
              whatChanged, odd
            )
            break
          case 'attributes':
          case 'models':
            processClassMemberships(
              clSpec, cl, localCl,
              whatChanged === 'attributes' ? 'atts' : 'model',
              customization, odd
            )
            break
          case 'classAtts':
            if (classType === 'attributes') {
              processAttributes(
                clSpec, cl, localCl, localsource, odd
              )
            }
          default:
            false
        }
      }
      // Cleanup
      if (clSpec) {
        if (clSpec.children.length === 0) {
          clSpec.parentNode.removeChild(clSpec)
        }
      }
    } else if (cl._changed && (cl._changed.join('') === 'included' || !isModuleSelected)) {
      // add classRef
      const clRef = odd.createElementNS('http://www.tei-c.org/ns/1.0', 'classRef')
      clRef.setAttribute('key', cl.ident)
      const schemaSpec = safeSelect(odd.querySelectorAll('schemaSpec'))[0]
      schemaSpec.appendChild(clRef)
    }
  }

  // Check for deleted classes.
  for (const cl of localsource.classes[classType]) {
    const customCl = customization.classes[classType].filter(cc => cc.ident === cl.ident)[0]
    const isModuleSelected = customization.modules.filter(x => x.ident === cl.module).length > 0
    if (!customCl && isModuleSelected && customization.classes._deleted) {
      // the class' module is selected, so it may need to be deleted explictely
      // Since it's impossible to distinguish between classe that have been deleted by the user
      // and classes that have been "zapped" during ODD compilation, we make sure that the class
      // is explicitely listed in customization.classes._deleted
      if (customization.classes._deleted.indexOf(cl.ident) !== -1) {
        const clSpec = getOrSetClassSpec(classType, odd, cl.ident)
        clSpec.setAttribute('mode', 'delete')
        // remove content as it's not needed any longer.
        let last
        while (last = clSpec.lastChild) clSpec.removeChild(last)
      }
    } else if (!customCl && !isModuleSelected) {
      // simply remove any existing declarations.
      const clSpec = safeSelect(odd.querySelectorAll(`classSpec[ident='${cl.ident}']`))[0]
      const clRef = safeSelect(odd.querySelectorAll(`classRef[key='${cl.ident}']`))[0]
      if (clSpec) {
        clSpec.parentNode.removeChild(clSpec)
      }
      if (clRef) {
        clRef.parentNode.removeChild(clRef)
      }
    }
  }

  return odd
}

export function updateClasses(localsource, customization, odd) {
  // Compare class declarations to apply changes to classes and return a new ODD
  let newOdd = processClasses('attributes', localsource, customization, odd)
  newOdd = processClasses('models', localsource, customization, odd)
  return newOdd
}
