import { deepCompare } from  '../../utils/deepCompare'
import { insertBetween } from './utils'
import { processDocEls, createDocEls } from './processDocEls'
import { processClassMemberships, createClassMemberships } from './processClassMemberships'
import { processAttributes, createAttributes } from './processAttributes'

function getOrSetElementSpec(odd, ident) {
  let elSpec = odd.querySelectorAll(`elementSpec[ident='${ident}']`)[0]
  // TODO: watch out for the @ns attribute in case there are more than one element with the same ident
  if (!elSpec) {
    elSpec = odd.createElementNS('http://www.tei-c.org/ns/1.0', 'elementSpec')
    elSpec.setAttribute('ident', ident)
    elSpec.setAttribute('mode', 'change')
    const schemaSpec = odd.querySelector('schemaSpec')
    schemaSpec.appendChild(elSpec)
  }
  return elSpec
}

export function updateElements(localsource, customization, odd) {
  // Compare element declarations to apply changes to elements and return a new ODD
  // Check against localsource to insure that the changes are actually there.
  // e.g. a user could change a desc, then backspace the change. The mode would be set to change, but
  // real change wouldn't really have happened.

  for (const el of customization.elements) {
    if (el._isNew) {
      // Create new spec
      const elSpec = odd.createElementNS('http://www.tei-c.org/ns/1.0', 'elementSpec')
      elSpec.setAttribute('ident', el.ident)
      if (el.ns) {
        elSpec.setAttribute('ns', el.ns)
      }
      elSpec.setAttribute('mode', 'add')

      // Create documentation elements
      createDocEls(elSpec, el, odd)

      // Create class memberships
      createClassMemberships(elSpec, el, odd)

      // Create attributes
      if (el.attributes) {
        createAttributes(elSpec, el, odd)
      }

      const schemaSpec = odd.querySelector('schemaSpec')
      schemaSpec.appendChild(elSpec)
    } else if (el._changed) {
      // Check structures against localsource
      const localEl = localsource.elements.filter(le => le.ident === el.ident)[0]
      // Create a dummy element for isomorphic conversion of serialized XML from the state to actual XML
      // TODO: find a cleaner isomorphic solution
      let changes = el._changed
      if (el._changed.indexOf('all') !== -1) {
        changes = ['desc', 'altIdent', 'attClasses', 'attributes', 'content']
      }
      for (const whatChanged of changes) {
        let elSpec
        switch (whatChanged) {
          case 'desc':
          case 'altIdent':
            elSpec = getOrSetElementSpec(odd, el.ident)
            processDocEls(elSpec, el, localEl, whatChanged, odd)
            break
          case 'attClasses':
          case 'modelClasses':
            elSpec = getOrSetElementSpec(odd, el.ident)
            processClassMemberships(
              elSpec, el, localEl,
              whatChanged === 'attClasses' ? 'atts' : 'model',
              customization, odd
            )
            break
          case 'attributes':
            elSpec = getOrSetElementSpec(odd, el.ident)
            processAttributes(elSpec, el, localEl, localsource, odd)
            break
          case 'content':
            const _cntToXml = (content, parent) => {
              for (const cntItem of content) {
                const cntItemEl = odd.createElementNS('http://www.tei-c.org/ns/1.0', cntItem.type)
                if (cntItem.key) {
                  cntItemEl.setAttribute('key', cntItem.key)
                }
                if (cntItem.maxOccurs) {
                  cntItemEl.setAttribute('maxOccurs', cntItem.maxOccurs)
                }
                if (cntItem.minOccurs) {
                  cntItemEl.setAttribute('minOccurs', cntItem.minOccurs)
                }
                if (cntItem.content) {
                  _cntToXml(cntItem.content, cntItemEl)
                }
                parent.appendChild(cntItemEl)
              }
            }
            if (!deepCompare(el.content, localEl.content)) {
              elSpec = getOrSetElementSpec(odd, el.ident)
              let contentEl = elSpec.querySelector('content')
              if (!contentEl) {
                contentEl = odd.createElementNS('http://www.tei-c.org/ns/1.0', 'content')
                // Place <content> after documentation elements in right position
                insertBetween(
                  elSpec, contentEl,
                  'desc, gloss, altIdent, equiv, classes',
                  'valList, constraintSpec, attList, model, modelGrp, modelSequence, exemplum, remarks, listRef')
              }
              // JSON -> XML
              _cntToXml(el.content, contentEl)
            }
            break
          default:
            false
        }
        // Cleanup
        if (elSpec) {
          if (elSpec.children.length === 0) {
            elSpec.parentNode.removeChild(elSpec)
          }
        }
      }
    }
  }

  localsource
  customization
  odd
  return odd
}
