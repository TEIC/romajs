import React from 'react'
import PropTypes from 'prop-types'
import { Component } from 'react'
import { MDCSimpleMenu } from '@material/menu'

export default class DonwloadButton extends Component {
  componentDidMount() {
    this.menu = new MDCSimpleMenu(this.refs.menu)
  }

  render() {
    return (
      <section className="mdc-toolbar__section mdc-toolbar__section--align-end mdc-menu-anchor" style={{right: '15px'}}>
        <button className="mdc-button mdc-button--raised toggle" onClick={(e) => {
          this.menu.open = !this.menu.open
          return e
        }}>
          <i className="material-icons mdc-button__icon">file_download</i> Download
        </button>
        <div className="romajs-download-menu mdc-simple-menu" ref="menu" tabIndex="-1">
          <ul className="mdc-simple-menu__items mdc-list" role="menu" aria-hidden="true" style={{transform: 'scale(1, 1)'}}>
            <li className="mdc-list-item" role="menuitem" tabIndex="0" onClick={()=>{this.props.downloadCustomization()}}>Download ODD</li>
            <li className="mdc-list-item" role="menuitem" tabIndex="0" onClick={()=>{this.props.downloadRng()}}>Download RelaxNG schema</li>
            <li className="mdc-list-item" role="menuitem" tabIndex="0" onClick={()=>{this.props.downloadW3c()}}>Download W3C schema</li>
          </ul>
        </div>
      </section>)
  }
}

DonwloadButton.propTypes = {
  downloadCustomization: PropTypes.func.isRequired,
  downloadRng: PropTypes.func.isRequired,
  downloadW3c: PropTypes.func.isRequired
}
