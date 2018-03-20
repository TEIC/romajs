import React, { Component } from 'react'
import PropTypes from 'prop-types'
import AttClassPicker from '../containers/AttClassPicker'

export default class Attributes extends Component {
  render() {
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
      </div>
    </div>)
  }
}

Attributes.propTypes = {
  element: PropTypes.object,
  deleteElementAttributeClass: PropTypes.func,
  clearPicker: PropTypes.func
}
