export const INCLUDE_MODULES = 'INCLUDE_MODULES'
export const EXCLUDE_MODULES = 'EXCLUDE_MODULES'
export const INCLUDE_ELEMENTS = 'INCLUDE_ELEMENTS'
export const EXCLUDE_ELEMENTS = 'EXCLUDE_ELEMENTS'

export function includeModules(modules) {
  return {
    type: INCLUDE_MODULES,
    modules
  }
}

export function excludeModules(modules) {
  return {
    type: EXCLUDE_MODULES,
    modules
  }
}

export function includeElements(elements) {
  return {
    type: INCLUDE_ELEMENTS,
    elements
  }
}

export function excludeElements(elements) {
  return {
    type: EXCLUDE_ELEMENTS,
    elements
  }
}
