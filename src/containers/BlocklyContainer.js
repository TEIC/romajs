import { connect } from 'react-redux'
import Blockly from '../components/Blockly'
import { updateContentModel } from '../actions/elements'
import { clone } from '../utils/clone'

const flattenContentModel = (cnt, flattened = [], depth = 1) => {
  cnt.map(c => {
    let copy = clone(c)
    switch (c.type) {
      case 'sequence':
      case 'alternate':
        copy.depth = depth
        const content = copy.content.slice(0)
        copy.content = true
        flattened.push(copy)
        flattenContentModel(content, flattened, depth + 1)
        break
      default:
        copy = clone(c)
        copy.depth = depth
        flattened.push(copy)
    }
  })
  return flattened
}

const mapStateToProps = (state, ownProps) => {
  // Flatten content model
  let flattenedContent = []
  if (ownProps.element.content) {
    flattenedContent = flattenContentModel(ownProps.element.content)
  }
  // Get all macros from state
  const customMacros = state.odd.customization.json.macros
  const customMacrosNames = customMacros.reduce((acc, cn) => {
    acc.push(cn.ident)
    return acc
  }, [])
  let localMacros = state.odd.localsource.json.macros
  localMacros = localMacros.filter((lc) => {
    return customMacrosNames.indexOf(lc.ident) === -1
  })
  const macros = []
  // TODO: sort by ident
  for (const ac of localMacros.concat(customMacros)) {
    macros.push([ac.ident, ac.ident])
  }

  // Get all datatypes from state
  const datatypes = []
  const customDatatypes = new Set(state.odd.customization.json.datatypes.map(d => {
    return d.ident
  }))
  const localDatatypes = new Set(state.odd.localsource.json.datatypes.map(d => {
    return d.ident
  }))
  for (const d of Array.from(new Set([...customDatatypes, ...localDatatypes]))) {
    datatypes.push([d, d])
  }
  // Get all elements from state
  const customElements = state.odd.customization.json.elements
  const customElementsNames = customElements.reduce((acc, cn) => {
    acc.push(cn.ident)
    return acc
  }, [])
  let localElements = state.odd.localsource.json.elements
  localElements = localElements.filter((lc) => {
    return customElementsNames.indexOf(lc.ident) === -1
  })
  const elements = []
  // TODO: sort by ident
  for (const ac of localElements.concat(customElements)) {
    elements.push([ac.ident, ac.ident])
  }

  // Get all classes from state
  // TODO: these should be selectors as they're used by more than one container's mapStateToProps
  // i.e. AttClassPicker and ModelClassPicker
  const attClasses = state.odd.customization.json.classes.attributes
  const modClasses = state.odd.customization.json.classes.models

  // TODO: sort by ident
  const classes = []
  for (const ac of attClasses) {
    classes.push([ac.ident, ac.ident])
  }
  for (const mc of modClasses) {
    classes.push([mc.ident, mc.ident])
  }
  return {flattenedContent, macros, classes, elements, datatypes, language: state.ui.language}
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    updateContentModel: (content) => dispatch(updateContentModel(ownProps.element.ident, content))
  }
}

const BlocklyContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Blockly)

export default BlocklyContainer
