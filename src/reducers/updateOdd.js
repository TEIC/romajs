import { mergeModules } from './odd/mergeModules'
import { mergeElements } from './odd/mergeElements'
import { updateClasses } from './odd/updateClasses'
import { updateElements } from './odd/updateElements'
import { updateDatatypes } from './odd/updateDatatypes'

const parser = new DOMParser()

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
