const parser = new DOMParser()

function mergeModules(localsource, customization, odd) {
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
  const memberRefs = Array.from(schemaSpec.querySelectorAll('elementRef, classRef, dataRef, macroRef'))
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
  // This function compares the original ODD and the customization to locate
  // changes in element selection via moduleRef or elementRef. It applies those changes and returns a new ODD.
  // NB It operates on the FIRST schemaSpec; this could be an issue.
  const schemaSpec = odd.querySelector('schemaSpec')
  const moduleRefs = schemaSpec.querySelectorAll('moduleRef')
  const elementSpecs = schemaSpec.querySelectorAll('elementSpec')
  const elementRefs = schemaSpec.querySelectorAll('elementRef')

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

function updateElements(localsource, customization, odd) {
  // Compare element declarations to apply changes to elements and return a new ODD
  // Check against localsource to insure that the changes are actually there.
  // e.g. a user could change a desc, then backspace the change. The mode would be set to change, but
  // real change wouldn't really have happened.

  function _areArraysEqual(a, b) {
    return a.length === b.length && a.every((value, index) => value === b[index])
  }

  function _getOrSetElementSpec(_odd, ident) {
    let elSpec = _odd.querySelectorAll(`elementSpec[ident='${ident}']`)[0]
    // TODO: watch out for the @ns attribute in case there are more than one element with the same ident
    if (!elSpec) {
      elSpec = _odd.createElementNS('http://www.tei-c.org/ns/1.0', 'elementSpec')
      elSpec.setAttribute('ident', ident)
      elSpec.setAttribute('mode', 'change')
      const schemaSpec = _odd.querySelector('schemaSpec')
      schemaSpec.appendChild(elSpec)
    }
    return elSpec
  }

  for (const el of customization.elements) {
    if (el._changed) {
      // Check structures against localsource
      const localEl = localsource.elements.filter(le => le.ident === el.ident)[0]
      // Create a dummy element for isomorphic conversion of serialized XML from the state to actual XML
      // TODO: find a cleaner isomorphic solution
      const dummyEl = odd.createElement('temp')
      for (const whatChanged of el._changed) {
        let elSpec
        switch (whatChanged) {
          case 'desc':
          case 'altIdent':
            if (!_areArraysEqual(el[whatChanged], localEl[whatChanged])) {
              elSpec = _getOrSetElementSpec(odd, el.ident)
              const docEls = elSpec.querySelectorAll(whatChanged)
              // create or replace descs. Determine mode.
              for (const [i, d] of el[whatChanged].entries()) {
                if (d.deleted) {
                  // Something got deleted, so apply
                  docEls[i].parentNode.removeChild(docEls[i])
                  continue
                }
                const docEl = docEls[i]
                let newDocEl
                // If the state keeps the full element as string (e.g. uses ACE editor), parse it.
                if (d.startsWith('<')) {
                  dummyEl.innerHTML = d
                  newDocEl = dummyEl.firstChild
                  newDocEl.removeAttribute('xmlns')
                  dummyEl.firstChild.remove()
                } else {
                  newDocEl = odd.createElementNS('http://www.tei-c.org/ns/1.0', whatChanged)
                  const text = odd.createTextNode(d)
                  newDocEl.appendChild(text)
                }
                if (docEl) {
                  elSpec.replaceChild(newDocEl, docEl)
                } else {
                  elSpec.appendChild(newDocEl)
                }
              }
            }
            break
          case 'attClasses':
            const change = Array.from(el.classes.atts).sort()
            const local = Array.from(localEl.classes.atts).sort()
            if (!_areArraysEqual(change, local)) {
              const added = change.filter(cl => local.indexOf(cl) === -1)
              const removed = local.filter(cl => {
                // Make sure the class isn't globally deleted.
                if (change.indexOf(cl) === -1) {
                  // This relies on truth-y and false-y values. watch out.
                  return customization.classes.attributes.filter(cc => cc.ident === cl)[0]
                } else return false
              })

              if (added.length > 0 || removed.length > 0) {
                elSpec = _getOrSetElementSpec(odd, el.ident)
                let classesEl = elSpec.querySelector('classes')
                if (!classesEl) {
                  classesEl = odd.createElementNS('http://www.tei-c.org/ns/1.0', 'classes')
                  // Place <classes> after documentation elements if present, or first.
                  const lastDocEl = Array.from(elSpec.querySelectorAll('desc, gloss, altIdent, equiv')).pop()
                  if (lastDocEl) {
                    elSpec.insertBefore(classesEl, lastDocEl.nextSibling)
                  } else {
                    elSpec.insertBefore(classesEl, elSpec.firstChild)
                  }
                }
                // Add
                for (const cl of added) {
                  const mOf = odd.createElementNS('http://www.tei-c.org/ns/1.0', 'memberOf')
                  mOf.setAttribute('key', cl)
                  classesEl.appendChild(mOf)
                }
                // Remove
                for (const cl of removed) {
                  const mOf = odd.createElementNS('http://www.tei-c.org/ns/1.0', 'memberOf')
                  mOf.setAttribute('key', cl)
                  mOf.setAttribute('mode', 'delete')
                  classesEl.appendChild(mOf)
                }
              }
            }
            break
          case 'attributes':
            // const changedAtts = el.attributes.reduce((acc, att) => {
            //   acc.push(att.ident)
            //   return acc
            // }, [])
            const localAtts = localEl.attributes.reduce((acc, att) => {
              acc.push(att.ident)
              return acc
            }, [])
            for (const att of el.attributes) {
              const toRemove = localAtts.indexOf(att.ident) !== -1 && att.mode === 'delete'
              const toAdd = localAtts.indexOf(att.ident) === -1
              if (toRemove || toAdd) {
                elSpec = _getOrSetElementSpec(odd, el.ident)
                let attList = elSpec.querySelector('attList')
                if (!attList) {
                  attList = odd.createElementNS('http://www.tei-c.org/ns/1.0', 'attList')
                  // Place <attList> after documentation elements in right position
                  /*
                    ( model.glossLike | model.descLike )*,
                    classes?,
                    content?,
                    valList?,
                    constraintSpec*,
                    --> attList?, <--
                    ( model | modelGrp | modelSequence )*,
                    exemplum*,
                    remarks*,
                    listRef*
                  */
                  const lastElBefore = Array.from(elSpec.querySelectorAll('desc, gloss, altIdent, equiv, classes, content, valList, constraintSpec')).pop()
                  if (lastElBefore) {
                    elSpec.insertBefore(attList, lastElBefore.nextSibling)
                  } else {
                    const firstElAfter = Array.from(elSpec.querySelectorAll('model, modelGrp, modelSequence, exemplum, remarks, listRef')).shift()
                    if (firstElAfter) {
                      elSpec.insertBefore(attList, firstElAfter)
                    } else {
                      elSpec.appendChild(attList)
                    }
                  }
                }
                // Add
                if (toAdd) {
                  const attDef = odd.createElementNS('http://www.tei-c.org/ns/1.0', 'attDef')
                  attDef.setAttribute('ident', att.ident)
                  attDef.setAttribute('mode', 'add')
                  attDef.setAttribute('ns', att.ns)
                  if (att.usage) {
                    attDef.setAttribute('ns', att.ns)
                  }
                  attList.appendChild(attDef)
                }
              }
            }
          default:
            false
        }
      }
    }
  }

  localsource
  customization
  odd
  return odd
}

export function updateOdd(localsourceObj, customizationObj) {
  // NB: localsource and customization are READ ONLY
  //     odd XML gets cloned every time to keep sub-routines pure
  //     and minimize errors. This will slow the export down a bit,
  //     but since it's a one-off operation, it should be ok.
  const localsource = localsourceObj.json
  const customization = customizationObj.json
  let odd = parser.parseFromString(customizationObj.xml, 'text/xml')
  // For testing. TODO: figure out a way to only do this in dev mode.
  if (global.usejsdom) {
    // replace DOM with JSDOM
    odd = global.usejsdom(odd)
  }

  // These operations need to happen synchronously
  // MODULE OPERATIONS (including excluding and including elements)
  odd = mergeModules(localsource, customization, odd.cloneNode(true))
  odd = mergeElements(localsource, customization, odd.cloneNode(true))
  // CHANGES TO ELEMENTS
  odd = updateElements(localsource, customization, odd.cloneNode(true))

  if (global.usejsdom) {
    return odd.documentElement.outerHTML
  }
  return new XMLSerializer().serializeToString(odd)
}

export default updateOdd
