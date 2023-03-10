import safeSelect from '../../utils/safeSelect'

export function areOddArraysEqual(a, b) {
  if (a === null || b === null) return false
  return a.length === b.length && a.every((value, index) => {
    // When checking descs, ignore versionDate
    const match = /[dD]esc.*?versionDate="[^""]+"/.exec(value)
    if (match) {
      return value.replace(/versionDate="[^""]+"/, '') === b[index].replace(/versionDate="[^""]+"/, '')
    }
    return value === b[index]
  })
}

export function areDocElsEqual(a, b) {
  const match = /[dD]esc.*?versionDate="[^""]+"/.exec(a)
  if (match) {
    return a.replace('xmlns="http://www.tei-c.org/ns/1.0"', '').replace(/versionDate="[^""]+"/, '').replace(/\s+/g, ' ') === b.replace('xmlns="http://www.tei-c.org/ns/1.0"', '').replace(/versionDate="[^""]+"/, '').replace(/\s+/g, ' ')
  }
  return a === b
}

export function insertBetween(parent, element, before, after) {
  const lastElBefore = Array.from(parent.children).filter(e => before.indexOf(e.tagName) !== -1).pop()
  if (lastElBefore) {
    parent.insertBefore(element, lastElBefore.nextElementSibling)
  } else {
    const firstElAfter = Array.from(parent.children).filter(e => after.indexOf(e.tagName) !== -1).shift()
    if (firstElAfter) {
      parent.insertBefore(element, firstElAfter)
    } else {
      parent.appendChild(element)
    }
  }
  return element
}

export function isMemberExplicitlyDeleted(odd, ident, type, module) {
  // A utility function that looks in the ODD XML for an explicit exclusion or deletion.

  // Look for element with ident
  const memberDef = safeSelect(odd.querySelectorAll(`schemaSpec > *[ident='${ident}'], specGrp > *[ident='${ident}']`))[0]
  if (memberDef) {
    return memberDef.getAttribute('mode') === 'delete'
  }

  // Look on moduleRef
  const moduleRef = safeSelect(odd.querySelectorAll(`schemaSpec > moduleRef[key='${module}'], specGrp > moduleRef[key='${module}']`))[0]

  if (moduleRef) {
    // If it's a class, it's always included.
    if (type === 'class') {
      return false
    }

    // Elements can be excluded on the moduleRef, so check.
    if (moduleRef.hasAttribute('include')) {
      const include = moduleRef.getAttribute('include')
      if (include.split(' ').indexOf(ident) === -1) {
        return true
      }
    } else if (moduleRef.hasAttribute('except')) {
      const except = moduleRef.getAttribute('except')
      if (except.split(' ').indexOf(ident) > -1) {
        return true
      }
    }
  }

  // at this point we assume that if there's no moduleRef, that counts as being explicitly excluded.
  return true
}
