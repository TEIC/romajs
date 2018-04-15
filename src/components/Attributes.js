import React, { Component } from 'react'
import PropTypes from 'prop-types'
import AttClassPicker from '../containers/AttClassPicker'
import EditAttribute from '../containers/EditAttribute'

export default class Attributes extends Component {
  render() {
    if (this.props.attribute) {
      return <EditAttribute member={this.props.element} attribute={this.props.attribute}/>
    } else {
      const sortedAttsfromClasses = this.props.attsfromClasses.slice()
      sortedAttsfromClasses.sort(function(a, b) {
        if (a.ident < b.ident) return -1
        else if (a.ident > b.ident) return 1
        return 0
      })
      return (<div className="mdc-layout-grid">
        <div className="mdc-layout-grid__inner romajs-formrow">
          <div className="mdc-layout-grid__cell--span-3">
            <label>Element attributes</label>
            <p className="mdc-text-field-helper-text mdc-text-field-helper-text--persistent">
              Edit attributes defined on this element.
            </p>
          </div>
          <div className="mdc-layout-grid__cell--span-8">
            <i className="material-icons romajs-clickable">add_circle_outline</i>
            <ul className="mdc-list" key="elatts">{
              this.props.element.attributes.map((c, pos) => {
                if (c.mode === 'add') {
                  return (<li key={`c${pos}`} className="mdc-list-item">
                    <span className="mdc-list-item__graphic">
                      <i className="material-icons romajs-clickable"
                        onClick={() => this.props.navigateTo(`${this.props.path}/${c.ident}`)}>
                        mode_edit</i>
                      <i className="material-icons romajs-clickable">clear</i>
                    </span>
                    <span className="mdc-list-item__text">
                      {c.ident}
                      <span className="mdc-list-item__secondary-text">
                        {c.shortDesc}
                      </span>
                    </span>
                  </li>)
                } else return null
              })
            }</ul>
          </div>
        </div>
        <div className="mdc-layout-grid__inner romajs-formrow">
          <div className="mdc-layout-grid__cell--span-3">
            <label>Attribute From Classes</label>
            <p className="mdc-text-field-helper-text mdc-text-field-helper-text--persistent">
              Elements can be members of attribute classes to inherit the attributes defined in a class. Here you can:
            </p>
            <ul className="mdc-text-field-helper-text mdc-text-field-helper-text--persistent">
              <li>Edit class attributes for this element only</li>
              <li>Delete / restore class attributes for this element only</li>
              <li>Change class memberships</li>
            </ul>
          </div>
          <div className="mdc-layout-grid__cell--span-8">
            <AttClassPicker element={this.props.element.ident}/>
            {sortedAttsfromClasses.map((cl, cpos) => {
              let inactiveClass = (<i className="material-icons romajs-clickable" onClick={() =>
                this.props.deleteElementAttributeClass(this.props.element.ident, cl.ident)}>clear</i>)
              if (cl.inactive) {
                inactiveClass = (<i className="material-icons romajs-clickable" onClick={() =>
                  this.props.restoreElementAttributeClass(this.props.element.ident, cl.ident)}>add_circle_outline</i>)
              }
              let sub = ''
              if (cl.sub) {
                sub = '(inherited)'
              }
              return [<h4 key={`clh${cpos}`}>
                {inactiveClass} From {cl.ident} {sub}</h4>,
                (<ul className="mdc-list" key={`cl${cpos}`}>{
                  cl.attributes.map((c, pos) => {
                    let overridden = ''
                    let overriddenText = ''
                    if (c.overridden) {
                      overridden = 'romajs-att-overridden'
                      overriddenText = '(changed for this element)'
                    }
                    const deleted = c.deleted ? 'romajs-att-deleted' : ''
                    let addOrRemove = (<i className={`material-icons romajs-clickable ${deleted}`} onClick={() =>
                      this.props.deleteClassAttribute(this.props.element.ident, cl.ident, c.ident)}>clear</i>)
                    if (c.deleted) {
                      addOrRemove = (<i className="material-icons romajs-clickable" onClick={() =>
                        this.props.restoreClassAttribute(this.props.element.ident, c.ident)}>add_circle_outline</i>)
                    }
                    return (<li key={`c${pos}`} className={`mdc-list-item ${overridden}`}>
                      <span className="mdc-list-item__graphic">
                        <i className={`material-icons romajs-clickable ${deleted}`}>mode_edit</i>
                        {addOrRemove}
                      </span>
                      <span className={`mdc-list-item__text ${deleted}`}>
                        {c.ident} <em>{overriddenText}</em>
                        <span className="mdc-list-item__secondary-text">
                          {c.shortDesc}
                        </span>
                      </span>
                    </li>)
                  })
                }</ul>)]
            })}
          </div>
        </div>
      </div>)
    }
  }
}

// <div className="mdc-layout-grid__cell--span-8">
//   <AttClassPicker element={this.props.element.ident}/>
//   <ul className="mdc-list">{
//     this.props.element.classes.atts.slice(0).sort().map((c, pos) => {
//       return (<li key={`c${pos}`} className="mdc-list-item">
//         <span className="mdc-list-item__graphic">
//           <i className="material-icons romajs-clickable" onClick={() =>
//             this.props.deleteElementAttributeClass(this.props.element.ident, c)}>clear</i>
//         </span>
//         <span className="mdc-list-item__text">
//           {c}
//           <span className="mdc-list-item__secondary-text">
//             {this.props.element.classDescs[c]}
//           </span>
//         </span>
//       </li>)
//     })
//   }</ul>
// </div>

Attributes.propTypes = {
  path: PropTypes.string.isRequired,
  element: PropTypes.object,
  attribute: PropTypes.string,
  attsfromClasses: PropTypes.array,
  deleteElementAttributeClass: PropTypes.func.isRequired,
  restoreElementAttributeClass: PropTypes.func.isRequired,
  deleteClassAttribute: PropTypes.func.isRequired,
  restoreClassAttribute: PropTypes.func.isRequired,
  clearPicker: PropTypes.func.isRequired,
  navigateTo: PropTypes.func.isRequired
}
