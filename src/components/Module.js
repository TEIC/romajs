import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class Module extends Component {
  render() {
    let ident = this.props.ident
    if (this.props.highlight && this.props.highlight.length > 0) {
      const m = ident.toLowerCase().match(this.props.highlight.toLowerCase())
      if (m) {
        const s = ident.slice(0, m.index)
        const mid = ident.slice(m.index, m.index + m[0].length)
        const e = ident.slice(m.index + m[0].length)
        ident = <span>{s}<i style={{fontStyle: 'normal', backgroundColor: '#d2aa28'}}>{mid}</i>{e}</span>
      }
    }
    const iconClass = this.props.selected ? 'romajs-color-no' : 'romajs-color-yes'
    const iconType = this.props.selected ? 'cancel' : 'add_circle'
    return (
      <div className="mdc-chip" onClick={() => {
        this.props.toggleModule(this.props.ident, this.props.selected)
      }}>
        <i className={`material-icons mdc-chip__icon mdc-chip__icon--leading ${iconClass}`}>{iconType}</i>
        <div className="mdc-chip__text"> ({ident})</div>
      </div>
    )
  }
}

Module.propTypes = {
  toggleModule: PropTypes.func.isRequired,
  ident: PropTypes.string.isRequired,
  selected: PropTypes.bool.isRequired,
  highlight: PropTypes.string
}
