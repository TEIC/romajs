import { areDocElsEqual } from './utils'

export function processDocEls(specElement, specData, localData, change, odd) {
  const dummyEl = odd.createElement('temp')
  for (const [i, d] of specData[change].entries()) {
    const docEl = specElement.querySelector(`${change}:nth-child(${i + 1})`)
    let comparison = null
    if (localData) {
      comparison = localData[change][i]
    }
    if (!areDocElsEqual(d, comparison)) {
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
        newDocEl = odd.createElementNS('http://www.tei-c.org/ns/1.0', change)
        const text = odd.createTextNode(d)
        newDocEl.appendChild(text)
      }
      if (docEl) {
        specElement.replaceChild(newDocEl, docEl)
      } else {
        specElement.appendChild(newDocEl)
      }
    } else if (!docEl) {
      // noop
    } else if (!areDocElsEqual(d !== docEl.outerHTML)) {
      // If we're returning to local source values, remove customization operation
      specElement.parentNode.removeChild(specElement)
    }
  }
  return odd
}

export function createDocEls(specElement, specData, odd) {
  for (const desc of specData.desc) {
    const dummyEl = odd.createElement('temp')
    dummyEl.innerHTML = desc
    const newDocEl = dummyEl.firstChild
    newDocEl.removeAttribute('xmlns')
    dummyEl.firstChild.remove()
    specElement.appendChild(newDocEl)
  }
  for (const altIdent of specData.altIdent) {
    const newDocEl = odd.createElementNS('http://www.tei-c.org/ns/1.0', 'altIdent')
    const text = odd.createTextNode(altIdent)
    newDocEl.appendChild(text)
    specElement.appendChild(newDocEl)
  }
  return odd
}
