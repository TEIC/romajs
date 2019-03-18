export const INCLUDE_MODULES = 'INCLUDE_MODULES'
export const EXCLUDE_MODULES = 'EXCLUDE_MODULES'
export const INCLUDE_ELEMENTS = 'INCLUDE_ELEMENTS'
export const EXCLUDE_ELEMENTS = 'EXCLUDE_ELEMENTS'
export const INCLUDE_CLASSES = 'INCLUDE_CLASSES'
export const EXCLUDE_CLASSES = 'EXCLUDE_CLASSES'
export const INCLUDE_DATATYPES = 'INCLUDE_DATATYPES'
export const EXCLUDE_DATATYPES = 'EXCLUDE_DATATYPES'

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

export function includeClasses(classes, classType) {
  return {
    type: INCLUDE_CLASSES,
    classes,
    classType
  }
}

export function excludeClasses(classes, classType) {
  return {
    type: EXCLUDE_CLASSES,
    classes,
    classType
  }
}

export function includeDatatypes(datatypes) {
  return {
    type: INCLUDE_DATATYPES,
    datatypes
  }
}

export function excludeDatatypes(datatypes) {
  return {
    type: EXCLUDE_DATATYPES,
    datatypes
  }
}
