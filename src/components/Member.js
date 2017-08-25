import React from 'react'
import PropTypes from 'prop-types'
import { Component } from 'react'
import SingleModule from '../containers/SingleModule'

export default class Member extends Component {
  render() {
    return (
      <li className="mdc-list-item mdc-elevation--z1">
        <span className="mdc-checkbox">
          <input type="checkbox" id="basic-checkbox" className="mdc-checkbox__native-control"
            checked={this.props.selected} onChange={() => this.props.toggleItem(this.props.ident, this.props.selected)}/>
          <span className="mdc-checkbox__background">
            <svg className="mdc-checkbox__checkmark" viewBox="0 0 24 24">
              <path className="mdc-checkbox__checkmark__path" fill="none" stroke="white" d="M1.73,12.91 8.1,19.28 22.79,4.59"/>
            </svg>
            <span className="mdc-checkbox__mixedmark"/>
          </span>
        </span>
        <span className="mdc-list-item__text">
          {this.props.ident}
          <span className="mdc-list-item__text__secondary">{this.props.desc}
          </span>
        </span>
        <span className="mdc-list-item__end-detail">
          <SingleModule
            selected={this.props.module_selected}
            ident={this.props.module} />
        </span>
      </li>
    )
  }
}

Member.propTypes = {
  toggleItem: PropTypes.func.isRequired,
  selected: PropTypes.bool.isRequired,
  ident: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
  module: PropTypes.string.isRequired,
  module_selected: PropTypes.bool.isRequired
}
