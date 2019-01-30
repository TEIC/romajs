import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class MembersFacet extends Component {
  toggleMemberTypeVisibility(type) {
    const types = new Set(this.props.visibleMemberTypes)
    if (types.has(type)) {
      if (types.size > 1) {
        types.delete(type)
      }
    } else {
      types.add(type)
    }
    this.props.setMemberTypeVisibility(Array.from(types))
  }

  render() {
    let ico = 'add_circle_outline'
    let activeClass = ''
    if (this.props.visibleMemberTypes.indexOf(this.props.type) !== -1) {
      ico = 'cancel'
      activeClass = 'romajs-active'
    }
    return (
      <div className={`mdc-chip ${activeClass}`} onClick={() => {
        this.toggleMemberTypeVisibility(this.props.type)
      }}>
        <i className="material-icons mdc-chip__icon mdc-chip__icon--leading">{ico}</i>
        <div className="mdc-chip__text">{this.props.label}</div>
      </div>
    )
  }
}

MembersFacet.propTypes = {
  setMemberTypeVisibility: PropTypes.func.isRequired,
  visibleMemberTypes: PropTypes.array.isRequired,
  type: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired
}
