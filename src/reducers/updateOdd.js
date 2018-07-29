function mergeModules(localsource, customization, odd) {
  // This function compares the original ODD and the customization to locate
  // changes in modules. It applies those changes and returns a new ODD.
  // NB It operates on the FIRST schemaSpec; this could be an issue.
  const schemaSpec = odd.getElementsByTagName('schemaSpec')[0]
  const oddModules = schemaSpec.getElementsByTagName('moduleRef')
  const customModuleNames = customization.modules.map(m => m.ident)
  const allLocalMembers = localsource.elements
    .concat(localsource.classes.models)
    .concat(localsource.classes.attributes)
    .concat(localsource.macros)
    .concat(localsource.datatypes)

  const oddModuleNames = Array.from(oddModules).reduce((acc, m) => {
    acc.add(m.getAttribute('key'))
    return acc
  }, new Set())
  // Add modules based on elementRef classRef dataRef macroRef (attRef?)
  // NB wish I could use querySelectorAll()!
  // TODO: you MAY use querySelectorAll when this code runs in the browser.
  // Change this to inject a polyfill when testing with node and you should be good to go.
  const memberRefs = Array.from(schemaSpec.childNodes).reduce((acc, child) => {
    if (child.localName === 'elementRef'
     || child.localName === 'classRef'
     || child.localName === 'dataRef'
     || child.localName === 'macroRef') {
      acc.push(child)
    }
    return acc
  }, [])
  memberRefs.map(el => {
    const ident = el.getAttribute('key')
    oddModuleNames.add(allLocalMembers.filter(m => m.ident === ident)[0].module)
  })

  // Determine new modules and add them appropriately
  for (const m of customization.modules) {
    if (!oddModuleNames.has(m.ident)) {
      // before adding the module, make sure it's meant to be added in full.
      let moduleElementsCount = 0
      let selectedElementsCount = 0
      for (const mem of localsource.elements) {
        if (mem.module === m.ident) {
          moduleElementsCount++
        }
      }
      for (const mem of customization.elements) {
        if (mem.module === m.ident) {
          selectedElementsCount++
        }
      }

      if (moduleElementsCount === selectedElementsCount) {
        const moduleEl = odd.createElement('moduleRef')
        moduleEl.setAttribute('key', m.ident)
        schemaSpec.insertBefore(moduleEl, oddModules[0])
      }
    }
  }

  // Determine unselected modules, remove them
  for (const oddModuleName of Array.from(oddModuleNames)) {
    if (customModuleNames.indexOf(oddModuleName) === -1) {
      const nodeToRemove = Array.from(oddModules).filter(om => (om.getAttribute('key') === oddModuleName))[0]
      // A moduleRef may not always be present (e.g. a module is selected via elementRef)
      if (nodeToRemove) {
        nodeToRemove.parentNode.removeChild(nodeToRemove)
      }
    }
  }

  return odd
}

function mergeElements(localsource, customization, odd) {
  const schemaSpec = odd.getElementsByTagName('schemaSpec')[0]
  const moduleRefs = schemaSpec.getElementsByTagName('moduleRef')
  const elementSpecs = schemaSpec.getElementsByTagName('elementSpec')
  const elementRefs = schemaSpec.getElementsByTagName('elementRef')

  // Get all elements from the XML ODD
  let allOddElements = Array.from(moduleRefs).reduce((includedElements, mod) => {
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
          const elMod = localsource.elements.filter(x => (x.ident === el))[0].module
          if (moduleName === elMod) {
            acc.push(el)
          }
        }
        return acc
      }, [])
      // console.log('full module ', mod.getAttribute('key'))
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

  // Get all elemnets from the state for comparison
  const customizationElements = customization.elements.reduce((acc, x) => {
    acc.push(x.ident)
    return acc
  }, [])

  // remove elements
  for (const el of Array.from(allOddElements)) {
    if (customizationElements.indexOf(el) === -1) {
      console.log('removing ' + el)
      const mod = localsource.elements.filter(x => (x.ident === el))[0].module
      // adjust @include or @except
      const moduleRef = Array.from(moduleRefs).filter(m => (m.getAttribute('key') === mod))[0]
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
      }
    }
  }

  // add elements
  for (const el of customizationElements) {
    if (!allOddElements.has(el)) {
      console.log('adding ' + el)
      const mod = localsource.elements.filter(x => (x.ident === el))[0].module
      // adjust @include or @except
      const moduleRef = Array.from(moduleRefs).filter(m => (m.getAttribute('key') === mod))[0]
      const elementRef = Array.from(elementRefs).filter(er => (er.getAttribute('key') === el))[0]
      const elementSpec = Array.from(elementSpecs).filter(er => (er.getAttribute('ident') === el))[0]

      if (moduleRef) {
        const include = moduleRef.getAttribute('include')
        const except = moduleRef.getAttribute('except')
        if (include) {
          moduleRef.setAttribute('include', `${include} ${el}`)
        } else if (except) {
          const exceptParts = except.match(/\S+/g)
          exceptParts.splice(exceptParts.indexOf(el), 1)
          const exceptString = exceptParts.join(' ')
          if (exceptString) {
            moduleRef.setAttribute('except', exceptString)
          } else {
            moduleRef.removeAttribute('except')
          }
        } else {
          moduleRef.setAttribute('include', el)
        }
      } else {
        // create moduleRef
        const newModuleRef = odd.createElement('moduleRef')
        newModuleRef.setAttribute('key', mod)
        newModuleRef.setAttribute('include', el)
        schemaSpec.insertBefore(newModuleRef, moduleRefs[0])
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
  // console.log(elementsToRemove)
  return odd
}

export function updateOdd(localsourceObj, customizationObj) {
  // NB: localsource and customization are READ ONLY
  //     odd XML gets cloned every time to keep sub-routines pure
  //     and minimize errors. This will slow the export down a bit,
  //     but since it's a one-off operation, it should be ok.
  const localsource = localsourceObj.json
  const customization = customizationObj.json
  let odd = new DOMParser().parseFromString(customizationObj.xml)

  // MODULES
  // These operations need to happen synchronously
  odd = mergeModules(localsource, customization, odd.cloneNode(true))
  odd = mergeElements(localsource, customization, odd.cloneNode(true))

  return new XMLSerializer().serializeToString(odd)
}

export default updateOdd
