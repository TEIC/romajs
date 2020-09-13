export function mergeModules(localsource, customization, odd) {
  // This function compares the original ODD and the customization to locate
  // changes in module selection. It applies those changes and returns a new ODD.
  // NB It operates on the FIRST schemaSpec; this could be an issue.
  const schemaSpec = odd.querySelector('schemaSpec')
  const oddModules = schemaSpec.querySelectorAll('moduleRef')
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
  // Using schemaSpec > elementRef to make sure content > elementRef is ignored
  const memberRefs = Array.from(
    odd.querySelectorAll(
      `specGrp > elementRef, specGrp > classRef, specGrp > specGrp, specGrp > macroRef,
      schemaSpec > elementRef, schemaSpec > classRef, schemaSpec > dataRef, schemaSpec > macroRef`
    ))
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
        const moduleEl = odd.createElementNS('http://www.tei-c.org/ns/1.0', 'moduleRef')
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
