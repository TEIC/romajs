import safeSelect from '../../utils/safeSelect'

const defaultExceptions = ['http://www.tei-c.org/ns/1.0', 'http://www.tei-c.org/ns/Examples']

export function mergeElements(localsource, customization, odd) {
  // This function compares the original ODD and the customization to locate
  // changes in element selection via moduleRef or elementRef. It applies those changes and returns a new ODD.
  // NB It operates on the FIRST schemaSpec; this could be an issue.
  const schemaSpec = safeSelect(odd.querySelectorAll('schemaSpec'))[0]
  const moduleRefs = safeSelect(odd.querySelectorAll('schemaSpec > moduleRef, specGrp > moduleRef'))
  const elementSpecs = safeSelect(odd.querySelectorAll('schemaSpec > elementSpec, specGrp > elementSpec'))
  const elementRefs = safeSelect(odd.querySelectorAll('schemaSpec > elementRef, specGrp > elementRef'))

  // Get all elements from the XML ODD
  let allOddElements = moduleRefs.reduce((includedElements, mod) => {
    const moduleName = mod.getAttribute('key')
    const include = mod.getAttribute('include')
    const except = mod.getAttribute('except')
    if (include) {
      includedElements.push(...include.match(/\S+/g))
    } else if (except) {
      const excludedElements = except.match(/\S+/g)
      localsource.elements.map(mem => {
        if (mem.module === moduleName && excludedElements.indexOf(mem.ident) === -1) {
          includedElements.push(mem.ident)
        }
      })
    } else {
      // the whole module is selected unless there's an elementSpec[@mode='delete']
      const deletedEls = Array.from(elementSpecs).reduce((acc, es) => {
        if (es.getAttribute('mode') === 'delete') {
          const el = es.getAttribute('ident')
          const elToDelete = localsource.elements.filter(x => (x.ident === el))[0]
          if (elToDelete) {
            const elMod = elToDelete.module
            if (moduleName === elMod) {
              acc.push(el)
            }
          } else {
            console.log('attempting to delete an element that does not exist!', el)
          }
        }
        return acc
      }, [])
      localsource.elements.map(mem => {
        if (mem.module === moduleName && deletedEls.indexOf(mem.ident) === -1) {
          includedElements.push(mem.ident)
        }
      })
    }
    return includedElements
  }, [])
  allOddElements = allOddElements.concat(Array.from(elementRefs).map(el => el.getAttribute('key')))
  // Also pick up any stray elementSpecs
  allOddElements = allOddElements.concat(Array.from(elementSpecs).reduce((acc, el) => {
    // TODO: temporarily muting elements in new namespace
    if (el.getAttribute('mode') !== 'delete' && !el.getAttribute('ns')) {
      acc.push(el.getAttribute('ident'))
    }
    return acc
  }, []))
  allOddElements = new Set(allOddElements)

  // Get all elements from the state for comparison
  const customizationElements = customization.elements

  // remove elements
  for (const el of Array.from(allOddElements)) {
    if (customizationElements.map(x => x.ident).indexOf(el) === -1) {
      console.log('removing ' + el)
      const localEl = localsource.elements.filter(x => (x.ident === el))[0]
      if (localEl) {
        const mod = localEl.module
        // adjust @include or @except
        const moduleRef = moduleRefs.filter(m => (m.getAttribute('key') === mod))[0]
        const elementRef = Array.from(elementRefs).filter(er => (er.getAttribute('key') === el))[0]
        const elementSpec = Array.from(elementSpecs).filter(er => (er.getAttribute('ident') === el))[0]

        if (moduleRef) {
          const include = moduleRef.getAttribute('include')
          const except = moduleRef.getAttribute('except')
          if (include) {
            const includeParts = include.match(/\S+/g)
            includeParts.splice(includeParts.indexOf(el), 1)
            const includeString = includeParts.join(' ')
            if (includeString) {
              moduleRef.setAttribute('include', includeString)
            } else {
              moduleRef.removeAttribute('include')
            }
          } else if (except) {
            moduleRef.setAttribute('except', `${except} ${el}`)
          } else {
            moduleRef.setAttribute('except', el)
          }
        }
        // remove elementRef
        if (elementRef) {
          elementRef.parentNode.removeChild(elementRef)
        }
        // switch elementSpec to @mode='delete'
        if (elementSpec) {
          elementSpec.setAttribute('mode', 'delete')
          // clear content
          while (elementSpec.firstChild) {
            elementSpec.removeChild(elementSpec.firstChild)
          }
        }
      } else {
        console.log('deleting an element that does not exist!', el)
      }
    }
  }

  // add elements
  for (const el of customizationElements) {
    // check that element's ns is declared on schemaSpec/@defaultExceptions
    if (el.ns && !defaultExceptions.includes(el.ns)) { // no need to add default values
      const exceptions = schemaSpec.getAttribute('defaultExceptions')
      if (!exceptions) {
        schemaSpec.setAttribute('defaultExceptions', [...defaultExceptions, el.ns].join(' '))
      } else {
        const namespaces = new Set([...exceptions.split(/\s+/), ...defaultExceptions, el.ns])
        schemaSpec.setAttribute('defaultExceptions', Array.from(namespaces).join(' '))
      }
    }
    // locate local el based on ident and ns.
    const localEl = localsource.elements.filter(x => (x.ident === el.ident && x.ns === el.ns))[0]
    if (!allOddElements.has(el.ident) && localEl) {
      const mod = localEl.module
      // adjust @include or @except
      const moduleRef = moduleRefs.filter(m => (m.getAttribute('key') === mod))[0]
      const elementRef = Array.from(elementRefs).filter(er => (er.getAttribute('key') === el))[0]
      const elementSpec = Array.from(elementSpecs).filter(er => (er.getAttribute('ident') === el))[0]

      if (moduleRef) {
        const include = moduleRef.getAttribute('include')
        const except = moduleRef.getAttribute('except')
        if (include) {
          moduleRef.setAttribute('include', `${include} ${el.ident}`)
        } else if (except) {
          const exceptParts = except.match(/\S+/g)
          exceptParts.splice(exceptParts.indexOf(el.ident), 1)
          const exceptString = exceptParts.join(' ')
          if (exceptString) {
            moduleRef.setAttribute('except', exceptString)
          } else {
            moduleRef.removeAttribute('except')
          }
        } else {
          moduleRef.setAttribute('include', el.ident)
        }
      } else {
        // create moduleRef
        const newModuleRef = odd.createElementNS('http://www.tei-c.org/ns/1.0', 'moduleRef')
        newModuleRef.setAttribute('key', mod)
        newModuleRef.setAttribute('include', el.ident)
        schemaSpec.append(newModuleRef)
        // add to list of existing moduleRefs
        moduleRefs.unshift(newModuleRef)
      }
      // remove elementRef
      if (elementRef) {
        elementRef.parentNode.removeChild(elementRef)
      }
      // remove elementSpec[@mode='delete']
      if (elementSpec) {
        if (elementSpec.getAttribute('mode') === 'delete') {
          elementSpec.parentNode.removeChild(elementSpec)
        }
      }
    }
  }

  const elementsToRemove = Array.from(allOddElements).filter(x => (customizationElements.indexOf(x) === -1))
  const elementsToAdd = customizationElements.filter(x => (!allOddElements.has(x)))
  elementsToRemove
  elementsToAdd
  return odd
}
