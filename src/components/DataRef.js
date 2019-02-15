import React, { Component } from 'react'
import PropTypes from 'prop-types'
import DatatypePicker from '../containers/DatatypePicker'

export default class DataRef extends Component {
  render() {
    return [
      <div className="mdc-layout-grid__inner romajs-formrow" key="dtp">
        <div className="mdc-layout-grid__cell--span-1">
          <DatatypePicker member={this.props.member.ident} memberType={this.props.memberType}
            attribute={this.props.attribute} index={this.props.index}/>
        </div>
        <div className="mdc-layout-grid__cell--span-11">
          {this.props.datatype}
        </div>
      </div>,
      <div className="mdc-layout-grid__inner" key="dtr">
        <div className="mdc-layout-grid__cell--span-1">Restriction</div>
        <div className="mdc-layout-grid__cell--span-11">
          <div className="mdc-text-field mdc-text-field--upgraded">
            <input type="text" className="mdc-text-field__input" value={this.props.restriction}
              onChange={(e) => this.props.setRestriction(e.target.value)}/>
            <div className="mdc-text-field__bottom-line" style={{transformOrigin: '145px center'}}/>
          </div>
        </div>
      </div>
    ]
  }
}

// TODO: Facets.

DataRef.propTypes = {
  member: PropTypes.object.isRequired,
  memberType: PropTypes.string.isRequired,
  datatype: PropTypes.string.isRequired,
  restriction: PropTypes.string,
  attribute: PropTypes.string,
  index: PropTypes.number,
  setRestriction: PropTypes.func.isRequired
}
