import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Desc from '../containers/EditAttributeDesc'

export default class Attribute extends Component {
  render() {
    return (<div className="mdc-layout-grid">
      <Desc member={this.props.member} attribute={this.props.attribute} />
      <div className="mdc-layout-grid__inner romajs-formrow">
        <div className="mdc-layout-grid__cell--span-3">
          <label>Namespace</label>
          <p className="mdc-text-field-helper-text mdc-text-field-helper-text--persistent">
            Set a namespace for this attribute. Leave empty for null namespace.
          </p>
        </div>
        <div className="mdc-layout-grid__cell--span-8">
          <div className="mdc-text-field mdc-text-field--upgraded">
            <input autoFocus type="text" className="mdc-text-field__input" value={this.props.attribute.ns}
              onChange={(e) => this.props.setNs(e.target.value)}/>
            <div className="mdc-text-field__bottom-line" style={{transformOrigin: '145px center'}}/>
          </div>
        </div>
      </div>
    </div>)
  }
}

Attribute.propTypes = {
  member: PropTypes.object.isRequired,
  attribute: PropTypes.object.isRequired,
  setNs: PropTypes.func.isRequired
}
