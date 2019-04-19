import { deepCompare } from  '../../utils/deepCompare'
import { insertBetween } from './utils'
import { processDocEls, createDocEls } from './processDocEls'

function getOrSetDataSpec(odd, ident) {
  let dtSpec = odd.querySelectorAll(`dataSpec[ident='${ident}']`)[0]
  if (!dtSpec) {
    dtSpec = odd.createElementNS('http://www.tei-c.org/ns/1.0', 'dataSpec')
    dtSpec.setAttribute('ident', ident)
    dtSpec.setAttribute('mode', 'change')
    const schemaSpec = odd.querySelector('schemaSpec')
    schemaSpec.appendChild(dtSpec)
  }
  return dtSpec
}

function cntToXml(content, parent, odd) {
  for (const cntItem of content) {
    const cntItemEl = odd.createElementNS('http://www.tei-c.org/ns/1.0', cntItem.type || 'valItem')
    if (cntItem.name) {
      cntItemEl.setAttribute('name', cntItem.name)
    }
    if (cntItem.ident) {
      cntItemEl.setAttribute('ident', cntItem.ident)
    }
    if (cntItem.key) {
      cntItemEl.setAttribute('key', cntItem.key)
    }
    if (cntItem.restriction) {
      cntItemEl.setAttribute('restriction', cntItem.restriction)
    }
    if (cntItem.maxOccurs) {
      cntItemEl.setAttribute('maxOccurs', cntItem.maxOccurs)
    }
    if (cntItem.minOccurs) {
      cntItemEl.setAttribute('minOccurs', cntItem.minOccurs)
    }
    if (cntItem.content) {
      cntToXml(cntItem.content, cntItemEl, odd)
    } else if (cntItem.valItem) {
      cntToXml(cntItem.valItem, cntItemEl, odd)
    }
    parent.appendChild(cntItemEl)
  }
  return content
}

function processDatatypes(localsource, customization, odd) {
  for (const dt of customization.datatypes) {
    const localDt = localsource.datatypes.filter(ldt => ldt.ident === dt.ident)[0]
    let isModuleSelected = true
    if (localDt) {
      isModuleSelected = customization.modules.filter(x => x.ident === localDt.module).length > 0
    }
    if (dt._isNew) {
      // Create new spec
      const dtSpec = odd.createElementNS('http://www.tei-c.org/ns/1.0', 'dataSpec')
      dtSpec.setAttribute('ident', dt.ident)
      dtSpec.setAttribute('mode', 'add')

      // Create documentation elements
      createDocEls(dtSpec, dt, odd)

      // Set content
      const contentEl = odd.createElementNS('http://www.tei-c.org/ns/1.0', 'content')
      cntToXml(dt.content, contentEl, odd)
      dtSpec.appendChild(contentEl)

      const schemaSpec = odd.querySelector('schemaSpec')
      schemaSpec.appendChild(dtSpec)
    } else if (dt._changed && isModuleSelected) {
      let changes = dt._changed
      if (dt._changed.indexOf('all') !== -1) {
        changes = ['desc', 'altIdent', 'content']
      }
      let dtSpec = getOrSetDataSpec(odd, dt.ident)
      for (const whatChanged of changes) {
        switch (whatChanged) {
          case 'desc':
          case 'altIdent':
            processDocEls(
              dtSpec, dt, localDt,
              whatChanged, odd
            )
            break
          case 'content':
            if (!deepCompare(dt.content, localDt.content)) {
              dtSpec = getOrSetDataSpec(odd, dt.ident)
              let contentEl = dtSpec.querySelector('content')
              if (!contentEl) {
                contentEl = odd.createElementNS('http://www.tei-c.org/ns/1.0', 'content')
                // Place <content> after documentation elements in right position
                insertBetween(
                  dtSpec, contentEl,
                  'desc, gloss, altIdent, equiv, classes',
                  'valList, constraintSpec, attList, model, modelGrp, modelSequence, exemplum, remarks, listRef')
              }
              // JSON -> XML
              cntToXml(dt.content, contentEl, odd)
            }
            break
          default:
            false
        }
        // Cleanup
        if (dtSpec) {
          if (dtSpec.children.length === 0) {
            dtSpec.parentNode.removeChild(dtSpec)
            dtSpec = null
          }
        }
      }
    } else if (dt._changed && !isModuleSelected) {
      // add dataRef
      const dtRef = odd.createElementNS('http://www.tei-c.org/ns/1.0', 'dataRef')
      dtRef.setAttribute('key', dt.ident)
      const schemaSpec = odd.querySelector('schemaSpec')
      schemaSpec.appendChild(dtRef)
    }
  }

  // Check for deleted datatypes.
  for (const dt of localsource.datatypes) {
    const customDt = customization.datatypes.filter(cdt => cdt.ident === dt.ident)[0]
    const isModuleSelected = customization.modules.filter(x => x.ident === dt.module).length > 0
    if (!customDt && isModuleSelected && customization._deleteddatatypes) {
      // the datatype module is selected, so it may need to be deleted explicitely
      // Since it's impossible to distinguish between datatypes that have been deleted by the user
      // and datatypes that have been "zapped" during ODD compilation, we make sure that the datatypes
      // is explicitely listed in customization._deleteddatatypes
      if (customization._deleteddatatypes.indexOf(dt.ident) !== -1) {
        const dtSpec = getOrSetDataSpec(odd, dt.ident)
        dtSpec.setAttribute('mode', 'delete')
        // remove content as it's not needed any longer.
        let last
        while (last = dtSpec.lastChild) dtSpec.removeChild(last)
      }
    } else if (!customDt && !isModuleSelected) {
      // simply remove any existing declarations.
      const dtSpec = odd.querySelectorAll(`dataSpec[ident='${dt.ident}']`)[0]
      const dtRef = odd.querySelectorAll(`dataRef[key='${dt.ident}']`)[0]
      if (dtSpec) {
        dtSpec.parentNode.removeChild(dtSpec)
      }
      if (dtRef) {
        dtRef.parentNode.removeChild(dtRef)
      }
    }
  }

  return odd
}

export function updateDatatypes(localsource, customization, odd) {
  // Compare class declarations to apply changes to classes and return a new ODD
  const newOdd = processDatatypes(localsource, customization, odd)
  return newOdd
}
