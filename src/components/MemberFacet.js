import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class MembersFacet extends Component {
  toggleMemberTypeVisibility(type) {
    // Option of aggregating. Keeping it here in case after user testing we decide to switch back.
    // const types = new Set(this.props.visibleMemberTypes)
    // if (types.has(type)) {
    //   if (types.size > 1) {
    //     types.delete(type)
    //   }
    // } else {
    //   types.add(type)
    // }
    if (this.props.visibleMemberTypes.indexOf(type) === -1) {
      this.props.setMemberTypeVisibility([type])
    }
  }

  render() {
    let checkmark = ''
    let activeClass = ''
    if (this.props.visibleMemberTypes.indexOf(this.props.type) !== -1) {
      checkmark = <i className="material-icons mdc-chip__icon mdc-chip__icon--leading">done</i>
      switch (this.props.type) {
        case 'elements':
          activeClass = 'romajs-active romajs-elbackground'
          break
        case 'datatypes':
          activeClass = 'romajs-active romajs-dtbackground'
          break
        default:
          activeClass = 'romajs-active'
      }
    }
    return (
      <div className={`mdc-chip mdc-ripple-upgraded ${activeClass} romajs-focusablechip`} tabIndex={0} onClick={() => {
        this.toggleMemberTypeVisibility(this.props.type)
      }} onKeyDown={(e) => {
        e.key === 'Enter' || e.key === ' ' ? this.toggleMemberTypeVisibility(this.props.type) : null
      }}>
        {checkmark}
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
