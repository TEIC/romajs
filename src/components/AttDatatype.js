import React, { Component } from 'react'
import PropTypes from 'prop-types'
import DataRef from './DataRef'
import { _i18n } from '../localization/i18n'

export default class AttDatatype extends Component {
  render() {
    const i18n = _i18n(this.props.language, 'AttDatatype')
    const rngContent = this.props.attribute.datatype.rngContent
    const refType = this.props.attribute.datatype.dataRef.key
      ? 'key'
      : 'name'
    const available = this.props.attribute.datatype.dataRef._deleted ? false : true
    const datatype = this.props.attribute.datatype.dataRef[refType]
    const restriction = this.props.attribute.datatype.dataRef.restriction || ''

    return (<div className="mdc-layout-grid__inner romajs-formrow">
      <div className="mdc-layout-grid__cell--span-3">
        <label>{i18n('Datatype')}</label>
        <p className="mdc-text-field-helper-text mdc-text-field-helper-text--persistent"
          dangerouslySetInnerHTML={{__html: i18n('HelperText')}} />
      </div>
      <div className="mdc-layout-grid__cell--span-9">
        <DataRef member={this.props.member}
          language={this.props.language}
          refType={refType}
          memberType={this.props.memberType}
          datatype={datatype}
          rngContent={rngContent}
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
  setDataTypeRestriction: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired
}
