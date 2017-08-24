import React from 'react'
import PropTypes from 'prop-types'
import { Component } from 'react'

export default class Header extends Component {
  render() {
    return (
      <header className="mdc-toolbar mdc-elevation--z4 mdc-toolbar--fixed romajs-toolbar">
        <div className="mdc-toolbar__row">
          <section className="mdc-toolbar__section mdc-toolbar__section--align-start">
            <span className="mdc-toolbar__title">Roma js - ODD customization</span>
          </section>
          <section className="mdc-toolbar__section mdc-toolbar__section--align-end">
            <input type="file" id="files"/>
            <a className="material-icons" title="Upload ODD" onClick={this.props.uploadCustomization}>file_upload</a>
            <a className="material-icons" title="Download ODD" onClick={()=>{this.props.onDownloadClick(this.props.odd.customization.json)}}>file_download</a>
          </section>
        </div>
        <div className="mdc-toolbar__row romajs-toolbar2">
          <section className="mdc-toolbar__section mdc-toolbar__section--align-start">
            <span className="mdl-chip mdl-chip--deletable romajs-itemtype-selected">
              <span className="mdl-chip__text">Elements</span>
              <button type="button" className="mdl-chip__action"><i className="material-icons">cancel</i></button>
            </span>
            <span className="mdl-chip mdl-chip--deletable">
              <span className="mdl-chip__text">Classes</span>
              <button type="button" className="mdl-chip__action"><i className="material-icons">add_circle</i></button>
            </span>
            <span className="mdl-chip mdl-chip--deletable">
              <span className="mdl-chip__text">Datatypes</span>
              <button type="button" className="mdl-chip__action"><i className="material-icons">add_circle</i></button>
            </span>
          </section>
          <section className="mdc-toolbar__section mdc-toolbar__section--align-end"/>
        </div>
      </header>
    )
  }
}

Header.propTypes = {
  uploadCustomization: PropTypes.func.isRequired,
  onDownloadClick: PropTypes.func.isRequired,
  odd: PropTypes.object
}
