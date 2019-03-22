import React, { Component } from 'react'
import PropTypes from 'prop-types'
import AltIdent from '../containers/EditMemberAltIdent'
import Desc from '../containers/EditMemberDesc'

export default class Documentation extends Component {
  render() {
    return (<div className="mdc-layout-grid">
      <AltIdent member={this.props.member} memberType={this.props.memberType} />
      <Desc member={this.props.member} docLang={this.props.docLang} memberType={this.props.memberType} />
    </div>)
  }
}

// Gloss
// Remarks
// Exempla
// listRef (read only)

Documentation.propTypes = {
  member: PropTypes.object.isRequired,
  memberType: PropTypes.string.isRequired,
  docLang: PropTypes.string.isRequired
}
