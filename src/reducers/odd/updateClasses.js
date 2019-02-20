import { processDocEls, createDocEls } from './processDocEls'
import { processClassMemberships, createClassMemberships } from './processClassMemberships'
import { processAttributes, createAttributes } from './processAttributes'

function getOrSetClassSpec(classType, odd, ident) {
  const type = classType === 'attributes' ? 'atts' : 'model'
  let clSpec = odd.querySelectorAll(`classSpec[ident='${ident}']`)[0]
  if (!clSpec) {
    clSpec = odd.createElementNS('http://www.tei-c.org/ns/1.0', 'classSpec')
    clSpec.setAttribute('ident', ident)
    clSpec.setAttribute('type', type)
    clSpec.setAttribute('mode', 'change')
    const schemaSpec = odd.querySelector('schemaSpec')
    schemaSpec.appendChild(clSpec)
  }
  return clSpec
}

function processClasses(classType, localsource, customization, odd) {
  for (const cl of customization.classes[classType]) {
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

      const schemaSpec = odd.querySelector('schemaSpec')
      schemaSpec.appendChild(clSpec)
    } else if (cl._changed) {
      let changes = cl._changed
      if (cl._changed.indexOf('all') !== -1) {
        changes = ['desc', 'altIdent', 'attributes', 'models']
      }
      const clSpec = getOrSetClassSpec(classType, odd, cl.ident)
      const localCl = localsource.classes[classType].filter(lc => lc.ident === cl.ident)[0]
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
        // Cleanup
        if (clSpec) {
          if (clSpec.children.length === 0) {
            clSpec.parentNode.removeChild(clSpec)
          }
        }
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
