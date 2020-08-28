import { areOddArraysEqual } from './utils'

export function processClassMemberships(specElement, specData, localData, change, customization, odd) {
  const changeClasses = specData.classes ? Array.from(specData.classes[change]).sort() : []
  const localClasses = localData.classes ? Array.from(localData.classes[change]).sort() : []
  if (!areOddArraysEqual(changeClasses, localClasses)) {
    const added = changeClasses.filter(scl => localClasses.indexOf(scl) === -1)
    const removed = localClasses.filter(scl => {
      // Make sure the class isn't globally deleted.
      if (changeClasses.indexOf(scl) === -1) {
        // This relies on truth-y and false-y values. watch out.
        const subClassType = change === 'atts' ? 'attributes' : 'models'
        return customization.classes[subClassType].filter(cc => cc.ident === scl)[0]
      } else return false
    })

    if (added.length > 0 || removed.length > 0) {
      let classesEl = specElement.querySelector('classes')
      if (!classesEl) {
        classesEl = odd.createElementNS('http://www.tei-c.org/ns/1.0', 'classes')
        classesEl.setAttribute('mode', 'change')
        // Place <classes> after documentation elements if present, or first.
        const lastDocEl = Array.from(specElement.querySelectorAll('desc, gloss, altIdent, equiv')).pop()
        if (lastDocEl) {
          specElement.insertBefore(classesEl, lastDocEl.nextElementSibling)
        } else if (specElement.firstChild) {
          specElement.insertBefore(classesEl, specElement.firstElementChild)
        } else {
          specElement.appendChild(classesEl)
        }
      }
      // Add
      for (const acl of added) {
        const mOf = odd.createElementNS('http://www.tei-c.org/ns/1.0', 'memberOf')
        mOf.setAttribute('key', acl)
        classesEl.appendChild(mOf)
      }
      // Remove
      for (const rcl of removed) {
        const mOf = odd.createElementNS('http://www.tei-c.org/ns/1.0', 'memberOf')
        mOf.setAttribute('key', rcl)
        mOf.setAttribute('mode', 'delete')
        classesEl.appendChild(mOf)
      }
    }
  } else if (specData._revert && Boolean(specData._changed)) {
    // remove customization element to return to source.
    if (specElement.parentNode) {
      specElement.parentNode.removeChild(specElement)
    }
  }
  return odd
}

export function createClassMemberships(specElement, specData, odd) {
  if (specData.classes) {
    const classesEl = odd.createElementNS('http://www.tei-c.org/ns/1.0', 'classes')
    for (const cl of specData.classes.atts.concat(specData.classes.model)) {
      const memberOf = odd.createElementNS('http://www.tei-c.org/ns/1.0', 'memberOf')
      memberOf.setAttribute('key', cl)
      classesEl.appendChild(memberOf)
    }
    specElement.appendChild(classesEl)
  }
  return odd
}
