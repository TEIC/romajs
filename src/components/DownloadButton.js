import React from 'react'
import PropTypes from 'prop-types'
import { Component } from 'react'
import { MDCMenu } from '@material/menu'
import { _i18n } from '../localization/i18n'
import InfoDialog from './dialogs/Info'

export default class DownloadButton extends Component {
  constructor(props) {
    super(props)
    const i18n = _i18n(this.props.language, 'DownloadButton')
    this.initialState = {
      showInfoDialog: false,
      infoHeader: i18n('The customization is not valid'),
      infoBody: i18n('errormsg')
    }
    this.state = this.initialState
  }

  componentDidMount() {
    this.menu = new MDCMenu(this.refs.menu)
  }

  render() {
    // Set language function
    const i18n = _i18n(this.props.language, 'DownloadButton')

    const handleDownload = (format) => {
      if (format === 'customization') {
        this.props.downloadCustomization()
      } else {
        this.setState({
          showInfoDialog: true,
          infoHeader: i18n('Generating the Customization'),
          infoBody: i18n('geninfo')
        })
        this.props.downloadSchema(format)
      }
    }

    return (
      <div style={{position: 'relative'}}>
        <button disabled={!this.props.isLoaded} className="mdc-button mdc-button--raised toggle" onClick={() => {
          if (!this.props.isOddValid) {
            this.setState({showInfoDialog: true})
          } else {
            this.menu.open = !this.menu.open
          }
        }}>
          <i className="material-icons mdc-button__icon">file_download</i> {i18n('Download')}
        </button>
        <div style={{position: 'relative'}}>
          <div key="opts" className="mdc-menu mdc-menu-surface" tabIndex="-1" ref="menu">
            <ul className="mdc-list" role="menu" aria-hidden="true">
              <li className="mdc-list-item" role="menuitem" tabIndex="0" onClick={()=>{handleDownload('customization')}}>
                {i18n('Customization as ODD')}
              </li>
              <li className="mdc-list-divider" role="separator"/>
              <li className="mdc-list-item" role="menuitem" tabIndex="0" onClick={()=>{handleDownload('compiled.odd')}}>
                {i18n('Compiled ODD')}
              </li>
              <li className="mdc-list-divider" role="separator"/>
              <li className="mdc-list-divider" role="separator"/>
              <li className="mdc-list-item" role="menuitem" tabIndex="0" onClick={()=>{handleDownload('rng')}}>
                {i18n('RELAX NG schema')}
              </li>
              <li className="mdc-list-divider" role="separator"/>
              <li className="mdc-list-item" role="menuitem" tabIndex="0" onClick={()=>{handleDownload('rnc')}}>
                {i18n('RELAX NG compact')}
              </li>
              <li className="mdc-list-divider" role="separator"/>
              <li className="mdc-list-item" role="menuitem" tabIndex="0" onClick={()=>{handleDownload('w3c')}}>
                {i18n('W3C schema')}
              </li>
              <li className="mdc-list-divider" role="separator"/>
              <li className="mdc-list-item" role="menuitem" tabIndex="0" onClick={()=>{handleDownload('dtd')}}>
                {i18n('DTD')}
              </li>
              <li className="mdc-list-divider" role="separator"/>
              <li className="mdc-list-item" role="menuitem" tabIndex="0" onClick={()=>{handleDownload('isosch')}}>
                {i18n('ISO Schematron constraints')}
              </li>
              <li className="mdc-list-divider" role="separator"/>
              <li className="mdc-list-divider" role="separator"/>
              <li className="mdc-list-item" role="menuitem" tabIndex="0" onClick={()=>{handleDownload('html')}}>
                {i18n('Documentation as HTML')}
              </li>
              <li className="mdc-list-divider" role="separator"/>
              <li className="mdc-list-item" role="menuitem" tabIndex="0" onClick={()=>{handleDownload('tei')}}>
                {i18n('Documentation as TEI Lite')}
              </li>
              <li className="mdc-list-divider" role="separator"/>
              <li className="mdc-list-item" role="menuitem" tabIndex="0" onClick={()=>{handleDownload('docx')}}>
                {i18n('Documentation as MS Word')}
              </li>
              <li className="mdc-list-divider" role="separator"/>
              <li className="mdc-list-item" role="menuitem" tabIndex="0" onClick={()=>{handleDownload('latex')}}>
                {i18n('Documentation as LaTeX')}
              </li>
              <li className="mdc-list-divider" role="separator"/>
              <li className="mdc-list-item" role="menuitem" tabIndex="0" onClick={()=>{handleDownload('pdf')}}>
                {i18n('Documentation as PDF')}
              </li>
            </ul>
          </div>
        </div>
        <InfoDialog key="id" show={this.state.showInfoDialog} hide={() => {this.setState(this.initialState)}}
          header={this.state.infoHeader} body={this.state.infoBody} />
      </div>
    )
  }
}

DownloadButton.propTypes = {
  isLoaded: PropTypes.bool.isRequired,
  language: PropTypes.string.isRequired,
  downloadCustomization: PropTypes.func.isRequired,
  downloadSchema: PropTypes.func.isRequired,
  isOddValid: PropTypes.bool.isRequired
}
