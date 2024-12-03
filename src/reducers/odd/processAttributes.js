import { processDocEls } from './processDocEls'
import { insertBetween } from './utils'

function createAttribute(attList, att, odd) {
  const attDef = odd.createElementNS('http://www.tei-c.org/ns/1.0', 'attDef')
  attDef.setAttribute('ident', att.ident)
  if (att.usage) {
    if (att.usage === 'def' && attDef.getAttribute('usage')) {
      attDef.removeAttribute('usage')
    } else if (att.usage !== 'def') {
      attDef.setAttribute('usage', att.usage)
    }
  }
  if (att.ns) {
    attDef.setAttribute('ns', att.ns)
  }
  if (att.valDesc) {
    for (const vd of att.valDesc) {
      const dummyEl = odd.createElement('temp')
      dummyEl.innerHTML = vd
      const valDesc = dummyEl.firstChild
      valDesc.removeAttribute('xmlns')
      dummyEl.firstChild.remove()
      attDef.appendChild(valDesc)
    }
  }
  if (att.valList) {
    const valList = odd.createElementNS('http://www.tei-c.org/ns/1.0', 'valList')
    if (att.valList.type) {
      valList.setAttribute('type', att.valList.type)
    }
    for (const val of att.valList.valItem) {
      const valItem = odd.createElementNS('http://www.tei-c.org/ns/1.0', 'valItem')
      valItem.setAttribute('ident', val.ident)
      // add descs
      processDocEls(valItem, val, null, 'desc', odd)
      valList.appendChild(valItem)
    }
    attDef.appendChild(valList)
  }
  if (att.datatype) {
    const datatype = odd.createElementNS('http://www.tei-c.org/ns/1.0', 'datatype')
    if (att.datatype.dataRef) {
      const dataRef = odd.createElementNS('http://www.tei-c.org/ns/1.0', 'dataRef')
      if (att.datatype.dataRef.name) {
        dataRef.setAttribute('name', att.datatype.dataRef.name)
      } else if (att.datatype.dataRef.key) {
        dataRef.setAttribute('key', att.datatype.dataRef.key)
      }

      if (att.datatype.dataRef.restriction) {
        dataRef.setAttribute('restriction', att.datatype.dataRef.restriction)
      }
      datatype.appendChild(dataRef)
    }
    insertBetween(
      attDef, datatype,
      ['desc', 'gloss', 'altIdent', 'equiv'],
      ['constraintSpec', 'defaultVal', 'valList', 'valDesc', 'exemplum', 'remarks'])
  }
  attList.appendChild(attDef)
  return odd
}

function changeAttr(att, localAtt, attDef, odd) {
  for (const whatChanged of att._changed) {
    let comparison = null
    switch (whatChanged) {
      case 'desc':
      case 'altIdent':
        processDocEls(attDef, att, localAtt, whatChanged, odd)
        break
      case 'usage':
      case 'ns':
        if (localAtt) {
          comparison = localAtt[whatChanged]
        }
        if (att[whatChanged] !== comparison) {
          attDef.setAttribute(whatChanged, att[whatChanged])
        } else if (attDef.getAttribute(whatChanged) && (att[whatChanged] !== attDef.getAttribute(whatChanged))) {
          // returning to local values means that customization is no longer needed!
          attDef.removeAttribute(whatChanged)
        }
        break
      case 'valList':
        for (const wchange of Object.keys(att.valList)) {
          switch (wchange) {
            case 'type':
              comparison = null
              if (localAtt) {
                if (localAtt.valList) {
                  comparison = localAtt.valList.type
                }
              }
              if (att.valList.type !== comparison) {
                let valListEl = attDef.querySelector('valList')
                if (!valListEl) {
                  valListEl = odd.createElementNS('http://www.tei-c.org/ns/1.0', 'valList')
                  attDef.appendChild(valListEl)
                }
                if (att.valList.type && att.valList.type !== '') {
                  valListEl.setAttribute('type', att.valList.type)
                }
                valListEl.setAttribute('mode', 'change')
              }
              break
            case 'valItem':
              comparison = []
              if (localAtt) {
                if (localAtt.valList) {
                  comparison = localAtt.valList.valItem
                }
              }
              // add
              for (const item of att.valList.valItem) {
                const compValItem = comparison.filter(v => v.ident === item.ident)[0]
                if (!compValItem) {
                  let valListEl = attDef.querySelector('valList')
                  if (!valListEl) {
                    valListEl = odd.createElementNS('http://www.tei-c.org/ns/1.0', 'valList')
                    attDef.appendChild(valListEl)
                  }
                  valListEl.setAttribute('mode', 'change')
                  let valItem = valListEl.querySelector(`valItem[ident="${item.ident}"]`)
                  if (!valItem) {
                    valItem = odd.createElementNS('http://www.tei-c.org/ns/1.0', 'valItem')
                    valListEl.appendChild(valItem)
                  }
                  valItem.setAttribute('mode', 'add')
                  valItem.setAttribute('ident', item.ident)
                  // add descs
                  processDocEls(valItem, item, compValItem, 'desc', odd)
                } else {
                  // change
                  // check descs
                  for (const [i, desc] of compValItem.desc.entries()) {
                    if (desc !== item.desc[i]) {
                      let valListEl = attDef.querySelector('valList')
                      if (!valListEl) {
                        valListEl = odd.createElementNS('http://www.tei-c.org/ns/1.0', 'valList')
                        attDef.appendChild(valListEl)
                      }
                      valListEl.setAttribute('mode', 'change')
                      let valItem = valListEl.querySelector(`valItem[ident="${item.ident}"]`)
                      if (!valItem) {
                        valItem = odd.createElementNS('http://www.tei-c.org/ns/1.0', 'valItem')
                        valListEl.appendChild(valItem)
                      }
                      valItem.setAttribute('mode', 'change')
                      valItem.setAttribute('ident', item.ident)
                      processDocEls(valItem, item, compValItem, 'desc', odd)
                    }
                  }
                }
              }
              // remove
              for (const item of comparison) {
                if (!att.valList.valItem.filter(v => v.ident === item.ident)[0]) {
                  let valListEl = attDef.querySelector('valList')
                  if (!valListEl) {
                    valListEl = odd.createElementNS('http://www.tei-c.org/ns/1.0', 'valList')
                    attDef.appendChild(valListEl)
                  }
                  valListEl.setAttribute('mode', 'change')
                  let valItem = valListEl.querySelector(`valItem[ident="${item.ident}"]`)
                  if (!valItem) {
                    valItem = odd.createElementNS('http://www.tei-c.org/ns/1.0', 'valItem')
                    valListEl.appendChild(valItem)
                  }
                  valItem.setAttribute('mode', 'delete')
                  valItem.setAttribute('ident', item.ident)
                }
              }
              // finally check that the XML actually reflects the JSON and drop what doesn't.
              // This may happen when a valItem was specified in an uploaded customization and
              // now it has been deleted. In this case it won't be in the comparison BUT it will be in the XML
              for (const vi of attDef.querySelectorAll('valItem')) {
                // if there is an element, but no definition in either customization or localsource,
                // get rid of the element
                const valItemIdent = vi.getAttribute('ident')
                if (!comparison.filter(c => c.ident === valItemIdent)[0] &&
                  !att.valList.valItem.filter(v => v.ident === valItemIdent)[0]) {
                  const valList = vi.parentNode
                  valList.removeChild(vi)
                }
              }
              // remove empty valList without a type change
              const valListEl = attDef.querySelector('valList')
              if (valListEl) {
                if (valListEl.children.length === 0 && !valListEl.getAttribute('type')) {
                  attDef.removeChild(valListEl)
                }
              }
              break
            default:
          }
        }
        break
      case 'datatype':
        for (const wchange of Object.keys(att.datatype.dataRef)) {
          switch (wchange) {
            case 'key':
            case 'name':
              comparison = null
              const type = att.datatype.dataRef.key ? 'key' : 'name'
              const otherType = type === 'key' ? 'name' : 'key'
              if (localAtt) {
                if (localAtt.datatype) {
                  comparison = localAtt.datatype.dataRef[type]
                }
              }
              if (att.datatype.dataRef[type] !== comparison) {
                let datatype = attDef.querySelector('datatype')
                if (!datatype) {
                  datatype = odd.createElementNS('http://www.tei-c.org/ns/1.0', 'datatype')
                  insertBetween(
                    attDef, datatype,
                    ['desc', 'gloss', 'altIdent', 'equiv'],
                    ['constraintSpec', 'defaultVal', 'valList', 'valDesc', 'exemplum', 'remarks'])
                }
                let dataRef = datatype.querySelector('dataRef')
                if (!dataRef) {
                  dataRef = odd.createElementNS('http://www.tei-c.org/ns/1.0', 'dataRef')
                  datatype.appendChild(dataRef)
                }
                dataRef.setAttribute(type, att.datatype.dataRef[type])
                dataRef.removeAttribute(otherType)
              }
              break
            case 'restriction':
              comparison = null
              if (localAtt) {
                if (localAtt.datatype) {
                  comparison = localAtt.datatype.dataRef.restriction
                }
              }
              if (att.datatype.dataRef.restriction !== comparison) {
                let datatype = attDef.querySelector('datatype')
                if (!datatype) {
                  datatype = odd.createElementNS('http://www.tei-c.org/ns/1.0', 'datatype')
                  insertBetween(
                    attDef, datatype,
                    ['desc', 'gloss', 'altIdent', 'equiv'],
                    ['constraintSpec', 'defaultVal', 'valList', 'valDesc', 'exemplum', 'remarks'])
                }
                let dataRef = datatype.querySelector('dataRef')
                if (!dataRef) {
                  dataRef = odd.createElementNS('http://www.tei-c.org/ns/1.0', 'dataRef')
                  datatype.appendChild(dataRef)
                }
                if (att.datatype.dataRef.key) {
                  dataRef.setAttribute('key', att.datatype.dataRef.key)
                } else if (att.datatype.dataRef.name) {
                  dataRef.setAttribute('name', att.datatype.dataRef.name)
                }
                dataRef.setAttribute('restriction', att.datatype.dataRef.restriction)
              }
            default:
          }
        }
        break
      default:
        // noop

      // TODO: Clean up. It's a bit hard to do safely. Which attributes / elements should be checked?
    }
  }
}

export function processAttributes(specElement, specData, localData, localsource, odd) {
  let localAtts = []
  if (localData) {
    localAtts = localData.attributes.reduce((acc, att) => {
      acc.push(att.ident)
      return acc
    }, [])
  }

  // restored attributes can be determined by comparing the custom ODD (specElement) and the
  // changes in Roma (specData). The rest should be determined against the localsource.

  const specAttIdents = specData.attributes.map(a => a.ident)
  const attsToRestore = Array.from(specElement.querySelectorAll('attList attDef')).filter(ad => !specAttIdents.includes(ad.getAttribute('ident')))
  attsToRestore.forEach(a => a.parentElement.removeChild(a))

  for (const att of specData.attributes) {
    const isDefined = localAtts.indexOf(att.ident) !== -1
    const toRemove = att.mode === 'delete'
    const toChange = ((att.mode === 'change' && Boolean(att._changed)) || (att.mode === 'add' && Boolean(att._changed)))
    const toRestore = (isDefined || att.inheritedFrom) && !toRemove && (att.mode === 'change' && !Boolean(att._changed))
    const toAdd = att._isNew || Boolean(att.clonedFrom) || (!isDefined && !toChange && !toRemove && !toRestore)

    if (toRemove || toChange || toAdd) {
      let attList = specElement.querySelector('attList')
      if (!attList) {
        attList = odd.createElementNS('http://www.tei-c.org/ns/1.0', 'attList')
        // Place <attList> after documentation elements in right position
        insertBetween(
          specElement, attList,
          ['desc', 'gloss', 'altIdent', 'equiv', 'classes', 'content', 'valList', 'constraintSpec'],
          ['model', 'modelGrp', 'modelSequence', 'exemplum', 'remarks', 'listRef'])
      }
      if (toAdd) {
        // Make sure the element isn't defined already
        // This may be caused by users attempting to remove or change attributes that
        // are not available on the spec.
        if (!specElement.querySelector(`attDef[ident="${att.ident}"]`)) {
          // Also make sure this is not an attribute cloned from another class,
          // in which case use <attRef>
          if (att.clonedFrom && !toChange && !att._restoredAfterDeletedOnClass) {
            // Only use attRef if there are no changes
            const attRef = odd.createElementNS('http://www.tei-c.org/ns/1.0', 'attRef')
            attRef.setAttribute('name', att.ident)
            attRef.setAttribute('class', att.clonedFrom)
            attList.appendChild(attRef)
          } else {
            createAttribute(attList, att, odd)
          }
        }
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
      } else if (toChange && att._changed) {
        // First deal with attributes defined on elements.
        if (localData) {
          const localAtt = localData.attributes.filter(la => att.ident === la.ident)[0]
          let comparisonAtt = localAtt
          if (att._fromClass) {
            // Is the attribute changed from the class? Otherwise get it from the class
            // get from class
            comparisonAtt = localAtt ? localAtt : localsource.classes.attributes
              .filter(lc => lc.ident === att._fromClass)[0].attributes
              .filter(lca => lca.ident === att.ident)[0]
          }
          if (!isDefined && !att._fromClass) {
            // We are updating a new attribute defined on this customization
            const attDef = attList.querySelector(`attDef[ident='${att.ident}']`)
            if (attDef) {
              changeAttr(att, null, attDef, odd)
            } else {
              const newAttDef = odd.createElementNS('http://www.tei-c.org/ns/1.0', 'attDef')
              newAttDef.setAttribute('ident', att.ident)
              newAttDef.setAttribute('mode', 'change')
              changeAttr(att, null, newAttDef, odd)
              attList.append(newAttDef)
            }
          } else {
            const attDef = attList.querySelector(`attDef[ident='${att.ident}']`)
            if (attDef) {
              // there are already some changes from the customization and there are new adjustments
              changeAttr(att, comparisonAtt, attDef, odd)
            } else {
              const newAttDef = odd.createElementNS('http://www.tei-c.org/ns/1.0', 'attDef')
              newAttDef.setAttribute('ident', att.ident)
              newAttDef.setAttribute('mode', 'change')
              changeAttr(att, comparisonAtt, newAttDef, odd)
              attList.append(newAttDef)
            }
          }
        }
      }
    } else if (toRestore) {
      const attDef = specElement.querySelector(`attDef[ident='${att.ident}']`)
      if (attDef) {
        const attList = attDef.parentNode
        attList.removeChild(attDef)
        if (attList.children.length === 0) {
          attList.parentNode.removeChild(attList)
        }
      } else {
        // noop. We're attempting to restore an unchanged attribute.
      }
    }
    // remove empty attDef without other attributes
    const attDef = specElement.querySelector(`attDef[ident="${att.ident}"]`)
    if (attDef) {
      if (
        (!attDef.getAttribute('mode') || attDef.getAttribute('mode') === 'change') &&
        attDef.getAttribute('ident') &&
        attDef.attributes.length <= 2 && attDef.children.length === 0) {
        attDef.parentNode.removeChild(attDef)
      }
    }
    // remove empty valLists without @org
    const attList = specElement.querySelector('attList')
    if (attList) {
      if (!attList.getAttribute('org') && attList.children.length === 0) {
        attList.parentNode.removeChild(attList)
      }
    }
  }
  return odd
}

export function createAttributes(specElement, specData, odd) {
  if (specData.attributes) {
    const attList = odd.createElementNS('http://www.tei-c.org/ns/1.0', 'attList')
    for (const att of specData.attributes) {
      createAttribute(attList, att, odd)
    }
    specElement.appendChild(attList)
  }
  return odd
}
