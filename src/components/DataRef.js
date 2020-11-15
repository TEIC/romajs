import React, { Component } from 'react'
import PropTypes from 'prop-types'
import DatatypePicker from '../containers/DatatypePicker'
import { Link } from 'react-router-dom'

export default class DataRef extends Component {
  render() {
    const unavailable = !this.props.available ? <span style={{color: 'red'}}> (Not available: deleted)</span> : null
    let restriction = ''
    if (this.props.refType === 'name') {
      restriction = (<div className="mdc-layout-grid__inner" key="dtr">
        <div className="mdc-layout-grid__cell--span-1">Restriction</div>
        <div className="mdc-layout-grid__cell--span-11">
          <div className="mdc-text-field mdc-text-field--upgraded">
            <input type="text" className="mdc-text-field__input" value={this.props.restriction}
              onChange={(e) => this.props.setRestriction(e.target.value)}/>
            <div className="mdc-text-field__bottom-line" style={{transformOrigin: '145px center'}}/>
          </div>
        </div>
      </div>)
    }
    return [
      <div className="mdc-layout-grid__inner romajs-formrow" key="dtp">
        <div className="mdc-layout-grid__cell--span-1">
          <DatatypePicker member={this.props.member.ident} memberType={this.props.memberType}
            attribute={this.props.attribute} index={this.props.index} message={
              <span>Not seeing something you're looking for? Add it on the&nbsp;
                <Link to="/members" target="_blank">Members Page</Link> (opens in new tab).</span>
            }/>
        </div>
        <div className="mdc-layout-grid__cell--span-11">
          {this.props.datatype}
          {unavailable}
        </div>
      </div>,
      restriction
    ]
  }
}

// TODO: Facets.

DataRef.propTypes = {
  refType: PropTypes.string.isRequired,
  member: PropTypes.object.isRequired,
  memberType: PropTypes.string.isRequired,
  datatype: PropTypes.string.isRequired,
  available: PropTypes.bool,
  restriction: PropTypes.string,
  attribute: PropTypes.string,
  index: PropTypes.number,
  setRestriction: PropTypes.func.isRequired
}
