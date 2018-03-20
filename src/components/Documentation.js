import React, { Component } from 'react'
import PropTypes from 'prop-types'
import AltIdent from '../containers/AltIdentContainer'
import Desc from '../containers/DescContainer'

export default class Documentation extends Component {
  render() {
    return (<div className="mdc-layout-grid">
      <AltIdent member={this.props.member} />
      <Desc member={this.props.member} />
    </div>)
  }
}

// Gloss
// Remarks
// Exempla
// listRef (read only)

Documentation.propTypes = {
  member: PropTypes.object.isRequired
}
