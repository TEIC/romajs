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

function mergeElements(localsource, customization, odd) {
  // This function compares the original ODD and the customization to locate
  // changes in element selection via moduleRef or elementRef. It applies those changes and returns a new ODD.
  // NB It operates on the FIRST schemaSpec; this could be an issue.
  const schemaSpec = odd.querySelector('schemaSpec')
  const moduleRefs = Array.from(schemaSpec.querySelectorAll('moduleRef'))
  const elementSpecs = schemaSpec.querySelectorAll('elementSpec')
  const elementRefs = schemaSpec.querySelectorAll('elementRef')

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
      }
    }
  }

  // add elements
  for (const el of customizationElements) {
    if (!allOddElements.has(el)) {
      console.log('adding ' + el)
      const mod = localsource.elements.filter(x => (x.ident === el))[0].module
      // adjust @include or @except
      const moduleRef = moduleRefs.filter(m => (m.getAttribute('key') === mod))[0]
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
        const newModuleRef = odd.createElementNS('http://www.tei-c.org/ns/1.0', 'moduleRef')
        newModuleRef.setAttribute('key', mod)
        newModuleRef.setAttribute('include', el)
        schemaSpec.insertBefore(newModuleRef, moduleRefs[0])
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
  // console.log(elementsToRemove)
  return odd
}

function updateElements(localsource, customization, odd) {
  // Compare element declarations to apply changes to elements and return a new ODD
  // Check against localsource to insure that the changes are actually there.
  // e.g. a user could change a desc, then backspace the change. The mode would be set to change, but
  // real change wouldn't really have happened.

  function _areArraysEqual(a, b) {
    return a.length === b.length && a.every((value, index) => {
      // When checking descs, ignore versionDate
      const match = /[dD]esc.*?versionDate="[^""]+"/.exec(value)
      if (match) {
        return value.replace(/versionDate="[^""]+"/, '') === b[index].replace(/versionDate="[^""]+"/, '')
      }
      return value === b[index]
    })
  }

  function _areDocElsEqual(a, b) {
    const match = /[dD]esc.*?versionDate="[^""]+"/.exec(a)
    if (match) {
      return a.replace('xmlns="http://www.tei-c.org/ns/1.0"', '').replace(/versionDate="[^""]+"/, '').replace(/\s+/g, ' ') === b.replace('xmlns="http://www.tei-c.org/ns/1.0"', '').replace(/versionDate="[^""]+"/, '').replace(/\s+/g, ' ')
    }
    return a === b
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

  function _insertBetween(parent, element, before, after) {
    const lastElBefore = Array.from(parent.querySelectorAll(before)).pop()
    if (lastElBefore) {
      parent.insertBefore(element, lastElBefore.nextSibling)
    } else {
      const firstElAfter = Array.from(parent.querySelectorAll(after)).shift()
      if (firstElAfter) {
        parent.insertBefore(element, firstElAfter)
      } else {
        parent.appendChild(element)
      }
    }
  }

  function _changeAttr(att, localAtt, attDef) {
    for (const whatChanged of att._changed) {
      switch (whatChanged) {
        case 'desc':
        case 'altIdent':
          for (const [i, d] of att[whatChanged].entries()) {
            const docEl = attDef.querySelector(`${whatChanged}:nth-child(${i + 1})`)
            if (!_areDocElsEqual(d, localAtt[whatChanged][i])) {
              // Change is differnet from the local source: apply changes
              if (d.deleted) {
                // Something got deleted, so apply
                docEl.parentNode.removeChild(docEl)
                continue
              }
              let newDocEl
              // If the state keeps the full element as string (e.g. uses ACE editor), parse it.
              if (d.startsWith('<')) {
                const dummyEl = odd.createElement('temp')
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
                attDef.replaceChild(newDocEl, docEl)
              } else {
                attDef.appendChild(newDocEl)
              }
            } else if (!_areDocElsEqual(d !== docEl.outerHTML)) {
              // If we're returning to local source values, remove customization operation
              attDef.parentNode.removeChild(attDef)
            }
          }
          break
        case 'usage':
        case 'ns':
          if (att[whatChanged] !== localAtt[whatChanged]) {
            attDef.setAttribute(whatChanged, att[whatChanged])
          } else if (attDef.getAttribute(whatChanged) && (att[whatChanged] !== attDef.getAttribute(whatChanged))) {
            // returning to local values means that customization is no longer needed!
            attDef.removeAttribute(whatChanged)
          }
          break
        default:
      }
    }
  }

  for (const el of customization.elements) {
    if (el._changed) {
      // Check structures against localsource
      const localEl = localsource.elements.filter(le => le.ident === el.ident)[0]
      // Create a dummy element for isomorphic conversion of serialized XML from the state to actual XML
      // TODO: find a cleaner isomorphic solution
      // TODO: merge with attribute desc handling
      const dummyEl = odd.createElement('temp')
      for (const whatChanged of el._changed) {
        let elSpec
        switch (whatChanged) {
          case 'desc':
          case 'altIdent':
            elSpec = _getOrSetElementSpec(odd, el.ident)
            for (const [i, d] of el[whatChanged].entries()) {
              const docEl = elSpec.querySelector(`${whatChanged}:nth-child(${i + 1})`)
              if (!_areDocElsEqual(d, localEl[whatChanged][i])) {
                // Change is differnet from the local source: apply changes
                if (d.deleted) {
                  // Something got deleted, so apply
                  docEl.parentNode.removeChild(docEl)
                  continue
                }
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
              } else if (!_areDocElsEqual(d !== docEl.outerHTML)) {
                // If we're returning to local source values, remove customization operation
                elSpec.parentNode.removeChild(elSpec)
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
              const isDefined = localAtts.indexOf(att.ident) !== -1
              const toRemove = isDefined && att.mode === 'delete'
              const toChange = (att.mode === 'change' || (att.mode === 'add' && Boolean(att._changed)))
              const toAdd = !isDefined && !toChange
              const toRestore = isDefined && !toRemove && att.mode !== 'change'

              if (toRemove || toChange || toAdd) {
                elSpec = _getOrSetElementSpec(odd, el.ident)
                let attList = elSpec.querySelector('attList')
                if (!attList) {
                  attList = odd.createElementNS('http://www.tei-c.org/ns/1.0', 'attList')
                  // Place <attList> after documentation elements in right position
                  _insertBetween(
                    elSpec, attList,
                    'desc, gloss, altIdent, equiv, classes, content, valList, constraintSpec',
                    'model, modelGrp, modelSequence, exemplum, remarks, listRef')
                }
                if (toAdd) {
                  const attDef = odd.createElementNS('http://www.tei-c.org/ns/1.0', 'attDef')
                  attDef.setAttribute('ident', att.ident)
                  // The mode is based on the customization:
                  // e.g. we may be "adding" an addDef to delete an attribute defined in a class
                  // Default is add
                  attDef.setAttribute('mode', att.mode || 'add')
                  if (att.ns) {
                    attDef.setAttribute('ns', att.ns)
                  }
                  if (!att.mode || att.mode === 'add') {
                    if (att.usage) {
                      attDef.setAttribute('usage', att.usage)
                    }
                    if (att.desc.length > 0) {
                      for (const desc of att.desc) {
                        dummyEl.innerHTML = desc
                        const docEl = dummyEl.firstChild
                        docEl.removeAttribute('xmlns')
                        dummyEl.firstChild.remove()
                        attDef.insertBefore(docEl, attDef.firstChild)
                      }
                    }
                    if (att.valDesc.length > 0) {
                      for (const valDesc of att.valDesc) {
                        dummyEl.innerHTML = valDesc
                        const docEl = dummyEl.firstChild
                        docEl.removeAttribute('xmlns')
                        dummyEl.firstChild.remove()
                        _insertBetween(
                          attDef, docEl,
                          'desc, gloss, altIdent, equiv, datatype, constraintSpec, defaultVal',
                          'exemplum, remarks')
                      }
                    }
                  }
                  attList.appendChild(attDef)
                } else if (toRemove) {
                  let attDef = attList.querySelector(`attDef[ident='${att.ident}'][mode='delete']`)
                  if (!attDef) {
                    attDef = odd.createElementNS('http://www.tei-c.org/ns/1.0', 'attDef')
                    attDef.setAttribute('ident', att.ident)
                    attDef.setAttribute('mode', 'delete')
                    if (att.ns) {
                      attDef.setAttribute('ns', att.ns)
                    }
                    attList.appendChild(attDef)
                  }
                } else if (toChange) {
                  // TODO CONTINUE HERE. Cover these cases:
                  // 1. attribute is defined on local element (isDefined && att.mode='change')
                  //    OK 1a. there are already some changes (attDef exists in customization) and there are new adjustments (att._changed)
                  //    OK 1b. this is the first time there are changes (no attDef and att._changed)
                  // 2. attribute is NOT defined on local element (!isDefined && att.mode='change')
                  //    OK 2a. the attribute is already defined in customization as an attribute on the element (att.mode = 'add') and needs to be updated (attDef and att._changed)
                  //    2b. the attribute comes from a class and there are already some updates (attDef and att._fromClass)
                  //    2c. the attribute comes from a class and there are no changes yet (!attDef, att._fromClass)
                  if (isDefined) {
                    const attDef = attList.querySelector(`attDef[ident='${att.ident}']`)
                    if (attDef) {
                      // there are already some changes from the customization and there are new adjustments
                      const localAtt = localEl.attributes.filter(la => att.ident === la.ident)[0]
                      _changeAttr(att, localAtt, attDef)
                    }
                  }
                }
              } else if (toRestore) {
                const attDef = odd.querySelector(`elementSpec[ident='${el.ident}'] attDef[ident='${att.ident}']`)
                const attList = attDef.parentNode
                attList.removeChild(attDef)
                // clean up
                if (attList.children.length === 0) {
                  elSpec = attList.parentNode
                  elSpec.removeChild(attList)
                  if (elSpec.children.length === 0) {
                    elSpec.parentNode.removeChild(elSpec)
                  }
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
