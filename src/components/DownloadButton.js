import React from 'react'
import PropTypes from 'prop-types'
import { Component } from 'react'
import { MDCMenu } from '@material/menu'

export default class DonwloadButton extends Component {
  componentDidMount() {
    this.menu = new MDCMenu(this.refs.menu)
  }

  render() {
    return [
      (<button className="mdc-button mdc-button--raised toggle" onClick={(e) => {
        this.menu.open = !this.menu.open
        return e
      }}>
        <i className="material-icons mdc-button__icon">file_download</i> Download
      </button>),
      (<div className="mdc-menu romajs-download-menu" tabIndex="-1" ref="menu">
        <ul className="mdc-menu__items mdc-list" role="menu" aria-hidden="true">
          <li className="mdc-list-item" role="menuitem" tabIndex="0" onClick={()=>{this.props.downloadCustomization()}}>Download ODD</li>
          <li className="mdc-list-item" role="menuitem" tabIndex="0" onClick={()=>{this.props.downloadRng()}}>Download RelaxNG schema</li>
          <li className="mdc-list-item" role="menuitem" tabIndex="0" onClick={()=>{this.props.downloadW3c()}}>Download W3C schema</li>
        </ul>
      </div>)
    ]
  }
}

DonwloadButton.propTypes = {
  downloadCustomization: PropTypes.func.isRequired,
  downloadRng: PropTypes.func.isRequired,
  downloadW3c: PropTypes.func.isRequired
}
