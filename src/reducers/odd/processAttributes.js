import processDocEls from './processDocEls'
import insertBetween from './utils'

function changeAttr(att, localAtt, attDef, odd) {
  for (const whatChanged of att._changed) {
    switch (whatChanged) {
      case 'desc':
      case 'altIdent':
        processDocEls(attDef, att, localAtt, whatChanged, odd)
        break
      case 'usage':
      case 'ns':
        let comparison = null
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
                if (!comparison.filter(v => v.ident === item.ident)[0]) {
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
                  attDef.appendChild(datatype)
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
                  attDef.appendChild(datatype)
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
  const localAtts = localData.attributes.reduce((acc, att) => {
    acc.push(att.ident)
    return acc
  }, [])
  for (const att of specData.attributes) {
    const isDefined = localAtts.indexOf(att.ident) !== -1
    const toRemove = isDefined && att.mode === 'delete'
    const toChange = (att.mode === 'change' || (att.mode === 'add' && Boolean(att._changed)))
    const toAdd = !isDefined && !toChange
    const toRestore = isDefined && !toRemove && att.mode !== 'change'
    // console.log(
    //   att.ident, att.mode,
    //   'torem', toRemove,
    //   'toch', toChange,
    //   'add', toAdd,
    //   'restore', toRestore)

    if (toRemove || toChange || toAdd) {
      // elSpec = _getOrSetElementSpec(odd, el.ident)
      let attList = specElement.querySelector('attList')
      if (!attList) {
        attList = odd.createElementNS('http://www.tei-c.org/ns/1.0', 'attList')
        // Place <attList> after documentation elements in right position
        insertBetween(
          specElement, attList,
          'desc, gloss, altIdent, equiv, classes, content, valList, constraintSpec',
          'model, modelGrp, modelSequence, exemplum, remarks, listRef')
      }
      if (toAdd) {
        // Make sure the element isn't define already
        // This may be caused by users attempting to remove or change attributes that
        // are not available on the spec.
        if (!specElement.querySelector(`attDef[ident="${att.ident}"]`)) {
          const attDef = odd.createElementNS('http://www.tei-c.org/ns/1.0', 'attDef')
          attDef.setAttribute('ident', att.ident)
          // The mode is based on the customization:
          // e.g. we may be "adding" an addDef to delete an attribute defined in a class.
          // Default is add
          attDef.setAttribute('mode', att.mode || 'add')
          if (att.ns) {
            attDef.setAttribute('ns', att.ns)
          }
          if (!att.mode || att.mode === 'add') {
            const dummyEl = odd.createElement('temp')
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
                insertBetween(
                  attDef, docEl,
                  'desc, gloss, altIdent, equiv, datatype, constraintSpec, defaultVal',
                  'exemplum, remarks')
              }
            }
          }
          attList.appendChild(attDef)
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
            changeAttr(att, null, attDef)
          } else {
            const newAttDef = odd.createElementNS('http://www.tei-c.org/ns/1.0', 'attDef')
            newAttDef.setAttribute('ident', att.ident)
            newAttDef.setAttribute('mode', 'change')
            changeAttr(att, null, newAttDef)
            attList.append(newAttDef)
          }
        } else {
          const attDef = attList.querySelector(`attDef[ident='${att.ident}']`)
          if (attDef) {
            // there are already some changes from the customization and there are new adjustments
            changeAttr(att, comparisonAtt, attDef)
          } else {
            const newAttDef = odd.createElementNS('http://www.tei-c.org/ns/1.0', 'attDef')
            newAttDef.setAttribute('ident', att.ident)
            newAttDef.setAttribute('mode', 'change')
            changeAttr(att, comparisonAtt, newAttDef)
            attList.append(newAttDef)
          }
        }
      }
    } else if (toRestore) {
      // elSpec = odd.querySelector(`elementSpec[ident='${el.ident}']`)
      const attDef = specElement.querySelector(`attDef[ident='${att.ident}']`)
      if (attDef) {
        const attList = attDef.parentNode
        attList.removeChild(attDef)
        if (attList.children.length === 0) {
          specElement.querySelector(`attList`).parentNode.remove()
        }
      } else {
        // noop. We're attempting to restore an unchanged attribute.
      }
    }
  }
  return odd
}
