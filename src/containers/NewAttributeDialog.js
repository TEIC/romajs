import { connect } from 'react-redux'
import NewAttribute from '../components/dialogs/NewAttribute'
import { push } from 'react-router-redux'

const mapStateToProps = (state, ownProps) => {
  const customClasses = state.odd.customization.json.classes.attributes
  const localClasses = state.odd.localsource.json.classes.attributes
  let customAtts = []
  const customAttsNames = []
  const attributes = []
  const associatedAttributes = ownProps.member.attributes.map(att => att.ident)
  // TODO: look for inherited attributes as well
  for (const cClass of customClasses) {
    customAtts = customAtts.concat(cClass.attributes)
    for (const cAtt of cClass.attributes) {
      customAttsNames.push(cAtt.ident)
    }
  }
  for (const lClass of localClasses) {
    if (lClass.attributes) {
      for (const lAtt of lClass.attributes) {
        const idx = customAttsNames.indexOf(lAtt.ident)
        if (idx > -1) {
          attributes.push(
            Object.assign({isLocal: false, fromClass: lClass.ident}, customAtts.filter(ca => (ca.ident === customAttsNames[idx]))[0])
          )
        } else {
          attributes.push(Object.assign({isLocal: true, fromClass: lClass.ident}, lAtt))
        }
      }
    }
  }


  attributes.sort((a, b) => {
    return a.ident > b.ident
  })
  return {show: ownProps.show, items: attributes, associatedAttributes, language: state.ui.language}
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    navigateToAttribute: (attName) => {dispatch(push(`attributes/${attName}`))},
    add: (attribute) => {
      dispatch(ownProps.add(ownProps.member.ident, attribute))
    }
  }
}

const NewAttributeDialog = connect(
  mapStateToProps,
  mapDispatchToProps
)(NewAttribute)

export default NewAttributeDialog
