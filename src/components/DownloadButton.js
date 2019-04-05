import React from 'react'
import PropTypes from 'prop-types'
import { Component } from 'react'
import { MDCMenu } from '@material/menu'
import { i18n as _i18n } from '../localization/DownloadButton'

export default class DonwloadButton extends Component {
  componentDidMount() {
    this.menu = new MDCMenu(this.refs.menu)
  }

  render() {
    // Set language function
    const i18n = _i18n(this.props.language)
    return (
      <div style={{position: 'relative'}}>
        <button disabled={!this.props.isLoaded} className="mdc-button mdc-button--raised toggle" onClick={(e) => {
          this.menu.open = !this.menu.open
          return e
        }}>
          <i className="material-icons mdc-button__icon">file_download</i> {i18n('Download')}
        </button>
        <div style={{position: 'relative'}}>
          <div key="opts" className="mdc-menu mdc-menu-surface" tabIndex="-1" ref="menu">
            <ul className="mdc-list" role="menu" aria-hidden="true">
              <li className="mdc-list-item" role="menuitem" tabIndex="0" onClick={()=>{this.props.downloadCustomization()}}>Save customization</li>
              <li className="mdc-list-item" role="menuitem" tabIndex="0" onClick={()=>{this.props.downloadSchema('rng')}}>RelaxNG schema</li>
              <li className="mdc-list-item" role="menuitem" tabIndex="0" onClick={()=>{this.props.downloadSchema('rnc')}}>RelaxNG compact</li>
              <li className="mdc-list-item" role="menuitem" tabIndex="0" onClick={()=>{this.props.downloadSchema('w3c')}}>W3C schema</li>
              <li className="mdc-list-item" role="menuitem" tabIndex="0" onClick={()=>{this.props.downloadSchema('dtd')}}>DTD</li>
              <li className="mdc-list-item" role="menuitem" tabIndex="0" onClick={()=>{this.props.downloadSchema('isosch')}}>ISO Schematron constraints</li>
              <li className="mdc-list-divider" role="separator"/>
              <li className="mdc-list-item" role="menuitem" tabIndex="0" onClick={()=>{this.props.downloadSchema('html')}}>Documentation as HTML</li>
              <li className="mdc-list-item" role="menuitem" tabIndex="0" onClick={()=>{this.props.downloadSchema('tei')}}>Documentation as TEI Lite</li>
              <li className="mdc-list-item" role="menuitem" tabIndex="0" onClick={()=>{this.props.downloadSchema('docx')}}>Documentation as MS Word</li>
              <li className="mdc-list-item" role="menuitem" tabIndex="0" onClick={()=>{this.props.downloadSchema('latex')}}>Documentation as LaTeX</li>
            </ul>
          </div>
        </div>
      </div>
    )
  }
}

DonwloadButton.propTypes = {
  isLoaded: PropTypes.bool.isRequired,
  language: PropTypes.string.isRequired,
  downloadCustomization: PropTypes.func.isRequired,
  downloadSchema: PropTypes.func.isRequired
}
