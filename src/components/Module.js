import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class Module extends Component {
  render() {
    const iconClass = this.props.selected ? 'romajs-color-no' : 'romajs-color-yes'
    const iconType = this.props.selected ? 'cancel' : 'add_circle'
    return (
      <span>
        <button type="button" className="mdl-chip__action"
          onClick={()=>this.props.toggleModule(this.props.ident, this.props.selected)}>
          <i className={'material-icons ' + iconClass}>{iconType}</i>
        </button> ({this.props.ident})</span>
    )
  }
}

Module.propTypes = {
  toggleModule: PropTypes.func.isRequired,
  ident: PropTypes.string.isRequired,
  selected: PropTypes.bool.isRequired
}
