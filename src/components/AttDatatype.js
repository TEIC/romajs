import React, { Component } from 'react'
import PropTypes from 'prop-types'
import DatatypePicker from '../containers/DatatypePicker'

export default class Attribute extends Component {
  render() {
    let datatype = this.props.attribute.datatype.dataRef.key
    if (!datatype) {
      datatype = this.props.attribute.datatype.dataRef.name
    }
    if (!datatype) {
      datatype = this.props.attribute.datatype.dataRef.ref
    }

    const restriction = this.props.attribute.datatype.dataRef.restriction || ''

    return (<div className="mdc-layout-grid__inner romajs-formrow">
      <div className="mdc-layout-grid__cell--span-3">
        <label>Datatype</label>
        <p className="mdc-text-field-helper-text mdc-text-field-helper-text--persistent">
          Set data type for this attribute.
        </p>
      </div>
      <div className="mdc-layout-grid__cell--span-9">
        <div className="mdc-layout-grid__inner romajs-formrow">
          <div className="mdc-layout-grid__cell--span-1">
            <DatatypePicker member={this.props.member.ident} attribute={this.props.attribute.ident}/>
          </div>
          <div className="mdc-layout-grid__cell--span-11">
            {datatype}
          </div>
        </div>
        <div className="mdc-layout-grid__inner">
          <div className="mdc-layout-grid__cell--span-1">Restriction</div>
          <div className="mdc-layout-grid__cell--span-11">
            <div className="mdc-text-field mdc-text-field--upgraded">
              <input type="text" className="mdc-text-field__input" value={restriction}
                onChange={(e) => this.props.setDataTypeRestriction(e.target.value)}/>
              <div className="mdc-text-field__bottom-line" style={{transformOrigin: '145px center'}}/>
            </div>
          </div>
        </div>
      </div>
    </div>)
  }
}

// TODO: Facets.

Attribute.propTypes = {
  member: PropTypes.object.isRequired,
  attribute: PropTypes.object.isRequired,
  setDataTypeRestriction: PropTypes.func.isRequired
}
