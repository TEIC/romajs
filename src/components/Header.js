import React from 'react'
import PropTypes from 'prop-types'
import { Component } from 'react'
import FilterSearch from '../containers/FilterSearch'
import {MDCSimpleMenu} from '@material/menu'

export default class Header extends Component {
  constructor(props) {
    super(props)
    this.state = { menu: undefined }
  }

  componentWillUpdate() {
    if (this.props.location !== '/' && !this.state.menu) {
      this.setState({
        menu: new MDCSimpleMenu(this.refs.menu)
      })
    }
  }

  render() {
    let filters = null
    let download = null
    if (this.props.location === '/members') {
      filters = (<div className="mdc-toolbar__row romajs-toolbar2" style={{zIndex: '-1'}}>
        <section className="mdc-toolbar__section mdc-toolbar__section--align-start">
          <span className="mdl-chip mdl-chip--deletable romajs-itemtype-selected">
            <span className="mdl-chip__text">Elements</span>
            <button type="button" className="mdl-chip__action"><i className="material-icons">cancel</i></button>
          </span>
        </section>
        <section className="mdc-toolbar__section mdc-toolbar__section--align-end">
          <FilterSearch/>
        </section>
      </div>)
    }
    if (this.props.location !== '/') {
      download = (
        <section className="mdc-toolbar__section mdc-toolbar__section--align-end mdc-menu-anchor" style={{right: '15px'}}>
          <button className="mdc-button mdc-button--raised toggle" onClick={(e) => {
            this.state.menu.open = !this.state.menu.open
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

    return (
      <header className="mdc-toolbar mdc-elevation--z4 mdc-toolbar--fixed romajs-toolbar">
        <div className="mdc-toolbar__row">
          <section className="mdc-toolbar__section mdc-toolbar__section--align-start">
            <span className="mdc-toolbar__title">Roma - ODD customization</span>
          </section>
          {download}
        </div>
        {filters}
      </header>
    )
  }
}

Header.propTypes = {
  location: PropTypes.string,
  downloadCustomization: PropTypes.func.isRequired,
  downloadRng: PropTypes.func.isRequired,
  downloadW3c: PropTypes.func.isRequired,
  odd: PropTypes.object
}
