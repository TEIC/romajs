import React from 'react'
import PropTypes from 'prop-types'
import { Component } from 'react'
import { MDCMenu } from '@material/menu'
import * as i18n from '../localization/DownloadButton'

export default class DonwloadButton extends Component {
  componentDidMount() {
    this.menu = new MDCMenu(this.refs.menu)
  }

  render() {
    return [
      (<button disabled={!this.props.isLoaded} key="dwnbtn" className="mdc-button mdc-button--raised toggle" onClick={(e) => {
        this.menu.open = !this.menu.open
        return e
      }}>
        <i className="material-icons mdc-button__icon">file_download</i> {i18n.download[this.props.language]}
      </button>),
      (<div key="opts" className="mdc-menu mdc-menu-surface" tabIndex="-1" ref="menu">
        <ul className="mdc-list" role="menu" aria-hidden="true">
          <li className="mdc-list-item" role="menuitem" tabIndex="0" onClick={()=>{this.props.downloadCustomization()}}>ODD</li>
          <li className="mdc-list-item" role="menuitem" tabIndex="0" onClick={()=>{this.props.downloadRng()}}>RelaxNG schema</li>
          <li className="mdc-list-item" role="menuitem" tabIndex="0" onClick={()=>{this.props.downloadW3c()}}>W3C schema</li>
        </ul>
      </div>)
    ]
  }
}

DonwloadButton.propTypes = {
  isLoaded: PropTypes.bool.isRequired,
  language: PropTypes.string.isRequired,
  downloadCustomization: PropTypes.func.isRequired,
  downloadRng: PropTypes.func.isRequired,
  downloadW3c: PropTypes.func.isRequired
}
