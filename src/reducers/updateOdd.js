import { DOMParser, XMLSerializer } from 'xmldom'

function mergeModules(localsource, customization, odd) {
  const schemaSpec = odd.getElementsByTagName('schemaSpec')[0]
  const oddModules = odd.getElementsByTagName('moduleRef')
  const customModuleNames = customization.modules.map(m => m.ident)

  const oddModuleNames = Array.from(oddModules).reduce((acc, m) => {
    acc.push(m.getAttribute('key'))
    return acc
  }, [])

  // Determine new modules and add them appropriately
  for (const m of customization.modules) {
    if (oddModuleNames.indexOf(m.ident) === -1) {
      // before adding the module, make sure it's meant to be added in full.
      let moduleElementsCount = 0
      let selectedElementsCount = 0
      for (const mem of localsource.members) {
        if (mem.type === 'elementSpec' && mem.module === m.ident) {
          moduleElementsCount++
        }
      }
      for (const mem of customization.members) {
        if (mem.type === 'elementSpec' && mem.module === m.ident) {
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
  for (const oddModuleName of oddModuleNames) {
    if (customModuleNames.indexOf(oddModuleName) === -1) {
      const nodeToRemove = Array.from(oddModules).filter(om => (om.getAttribute('key') === oddModuleName))[0]
      nodeToRemove.parentNode.removeChild(nodeToRemove)
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
      includedElements.push(...include.split(/\s/))
    } else if (except) {
      const excludedElements = except.split(/\s/)
      localsource.members.map(mem => {
        if (mem.type === 'elementSpec' && mem.module === moduleName && excludedElements.indexOf(mem.ident) === -1) {
          includedElements.push(mem.ident)
        }
      })
    } else {
      // the whole module is selected unless there's an elementSpec[@mode='delete']
      const deletedEls = Array.from(elementSpecs).reduce((acc, es) => {
        if (es.getAttribute('mode') === 'delete') {
          const el = es.getAttribute('ident')
          const elMod = localsource.members.filter(x => (x.ident === el))[0].module
          if (moduleName === elMod) {
            acc.push(el)
          }
        }
        return acc
      }, [])
      // console.log('full module ', mod.getAttribute('key'))
      localsource.members.map(mem => {
        if (mem.type === 'elementSpec' && mem.module === moduleName && deletedEls.indexOf(mem.ident) === -1) {
          includedElements.push(mem.ident)
        }
      })
    }
    return includedElements
  }, [])
  allOddElements = allOddElements.concat(Array.from(elementRefs).map(el => el.getAttribute('key')))
  // Also pick up any stray elementSpecs
  allOddElements = allOddElements.concat(Array.from(elementSpecs).reduce((acc, el) => {
    if (el.getAttribute('mode') !== 'delete') {
      acc.push(el.getAttribute('ident'))
    }
    return acc
  }, []))

  // Get all elemnets from the state for comparison
  const customizationElements = customization.members.reduce((acc, x) => {
    if (x.type === 'elementSpec') {
      acc.push(x.ident)
    }
    return acc
  }, [])

  // remove elements
  for (const el of allOddElements) {
    if (customizationElements.indexOf(el) === -1) {
      console.log('removing ' + el)
      const mod = localsource.members.filter(x => (x.ident === el))[0].module
      // adjust @include or @except
      const moduleRef = Array.from(moduleRefs).filter(m => (m.getAttribute('key') === mod))[0]
      const elementRef = Array.from(elementRefs).filter(er => (er.getAttribute('key') === el))[0]
      const elementSpec = Array.from(elementSpecs).filter(er => (er.getAttribute('ident') === el))[0]

      if (moduleRef) {
        const include = moduleRef.getAttribute('include')
        const except = moduleRef.getAttribute('except')
        if (include) {
          const includeParts = include.split(/\s/)
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
    if (allOddElements.indexOf(el) === -1) {
      console.log('adding ' + el)
      const mod = localsource.members.filter(x => (x.ident === el))[0].module
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
          const exceptParts = except.split(/\s/)
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

  const elementsToRemove = allOddElements.filter(x => (customizationElements.indexOf(x) === -1))
  const elementsToAdd = customizationElements.filter(x => (allOddElements.indexOf(x) === -1))
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
