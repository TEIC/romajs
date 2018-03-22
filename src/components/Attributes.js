import React, { Component } from 'react'
import PropTypes from 'prop-types'
import AttClassPicker from '../containers/AttClassPicker'
import EditAttribute from '../containers/EditAttribute'

export default class Attributes extends Component {
  render() {
    if (this.props.attribute) {
      return <EditAttribute member={this.props.element} attribute={this.props.attribute}/>
    } else {
      return (<div className="mdc-layout-grid">
        <div className="mdc-layout-grid__inner romajs-formrow">
          <div className="mdc-layout-grid__cell--span-3">
            <label>Attribute Classes</label>
            <p className="mdc-text-field-helper-text mdc-text-field-helper-text--persistent">
              Elements can be members of attribute classes to inherit the attributes defined in a class. <br/>
              Change class membership here.
            </p>
          </div>
          <div className="mdc-layout-grid__cell--span-8">
            <AttClassPicker element={this.props.element.ident}/>
            <ul className="mdc-list">{
              this.props.element.classes.atts.slice(0).sort().map((c, pos) => {
                return (<li key={`c${pos}`} className="mdc-list-item">
                  <span className="mdc-list-item__graphic">
                    <i className="material-icons romajs-clickable" onClick={() =>
                      this.props.deleteElementAttributeClass(this.props.element.ident, c)}>clear</i>
                  </span>
                  <span className="mdc-list-item__text">
                    {c}
                    <span className="mdc-list-item__secondary-text">
                      {this.props.element.classDescs[c]}
                    </span>
                  </span>
                </li>)
              })
            }</ul>
          </div>
          <div className="mdc-layout-grid__cell--span-3">
            <label>All Attributes</label>
            <p className="mdc-text-field-helper-text mdc-text-field-helper-text--persistent">
              Edit attributes for this element only.
            </p>
          </div>
          <div className="mdc-layout-grid__cell--span-8">{
            [[<h4 key="elattsh" >Defined on this element</h4>,
              (<ul className="mdc-list" key="elatts">{
                this.props.element.attributes.map((c, pos) => {
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
                })
              }</ul>)],
            this.props.attsfromClasses.map((cl, cpos) => {
              return [<h4 key={`clh${cpos}`}>{cl.ident}</h4>,
                (<ul className="mdc-list" key={`cl${cpos}`}>{
                  cl.attributes.map((c, pos) => {
                    const overridden = c.overridden ? 'romajs-att-overridden' : ''
                    return (<li key={`c${pos}`} className={`mdc-list-item ${overridden}`}>
                      <span className="mdc-list-item__graphic">
                        <i className="material-icons romajs-clickable">mode_edit</i>
                      </span>
                      <span className="mdc-list-item__text">
                        {c.ident}
                        <span className="mdc-list-item__secondary-text">
                          {c.shortDesc}
                        </span>
                      </span>
                    </li>)
                  })
                }</ul>)]
            })]
          }</div>
        </div>
      </div>)
    }
  }
}

Attributes.propTypes = {
  path: PropTypes.string.isRequired,
  element: PropTypes.object,
  attribute: PropTypes.string,
  attsfromClasses: PropTypes.array,
  deleteElementAttributeClass: PropTypes.func.isRequired,
  clearPicker: PropTypes.func.isRequired,
  navigateTo: PropTypes.func.isRequired
}
