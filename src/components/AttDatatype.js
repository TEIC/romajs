import React, { Component } from 'react'
import PropTypes from 'prop-types'
import DataRef from './DataRef'

export default class AttDatatype extends Component {
  render() {
    let datatype = this.props.attribute.datatype.dataRef.key
    const available = this.props.attribute.datatype.dataRef._deleted ? false : true
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
        <DataRef member={this.props.member}
          memberType={this.props.memberType}
          datatype={datatype}
          available={available}
          restriction={restriction}
          attribute={this.props.attribute.ident}
          setRestriction={this.props.setDataTypeRestriction} />
      </div>
    </div>)
  }
}

AttDatatype.propTypes = {
  member: PropTypes.object.isRequired,
  memberType: PropTypes.string.isRequired,
  attribute: PropTypes.object.isRequired,
  setDataTypeRestriction: PropTypes.func.isRequired
}
