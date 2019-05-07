import { mergeModules } from './odd/mergeModules'
import { mergeElements } from './odd/mergeElements'
import { updateClasses } from './odd/updateClasses'
import { updateElements } from './odd/updateElements'
import { updateDatatypes } from './odd/updateDatatypes'

const parser = new DOMParser()

function updateMetadata(customization, odd) {
  const schemaSpec = odd.querySelector('schemaSpec')
  // We assume these elements exist because they are required in TEI
  const titleStmt = odd.querySelector('teiHeader fileDesc titleStmt') || {}
  const titleEl = titleStmt.querySelector('title') || {}
  const authorEl = titleStmt.querySelector('author') || {}
  if (customization.title !== titleEl.textContent) {
    titleEl.textContent = customization.title
  }
  if (customization.author !== authorEl.textContent) {
    authorEl.textContent = customization.author
  }
  const filename = schemaSpec.getAttribute('ident')
  if (customization.filename !== filename) {
    schemaSpec.setAttribute('ident', customization.filename)
  }
  const prefix = schemaSpec.getAttribute('prefix')
  if (customization.prefix !== prefix) {
    schemaSpec.setAttribute('prefix', customization.prefix)
  }
  const targetLang = schemaSpec.getAttribute('targetLang')
  if (customization.targetLang !== targetLang) {
    schemaSpec.setAttribute('targetLang', customization.targetLang)
  }
  const docLang = schemaSpec.getAttribute('docLang')
  if (customization.docLang !== docLang) {
    schemaSpec.setAttribute('docLang', customization.docLang)
  }

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

  // The following operations need to happen synchronously

  // SETTINGS (METADATA)
  odd = updateMetadata(customization, odd.cloneNode(true))

  // MODULE OPERATIONS (including excluding and including elements)
  odd = mergeModules(localsource, customization, odd.cloneNode(true))
  odd = mergeElements(localsource, customization, odd.cloneNode(true))
  // CHANGES TO ELEMENTS
  odd = updateElements(localsource, customization, odd.cloneNode(true))
  // CHANGES TO CLASSES
  odd = updateClasses(localsource, customization, odd.cloneNode(true))
  // CHANGES TO DATATYPES
  odd = updateDatatypes(localsource, customization, odd.cloneNode(true))

  if (global.usejsdom) {
    return odd.documentElement.outerHTML
  }
  return new XMLSerializer().serializeToString(odd)
}

export default updateOdd
