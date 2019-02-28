import React from 'react'
import PropTypes from 'prop-types'
import { Component } from 'react'
import Download from '../containers/Download'
import YesNoDialog from './dialogs/YesNo'
import * as i18n from '../localization/Header'
import { MDCMenu } from '@material/menu'

export default class Header extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showStartOver: false
    }
  }

  componentDidMount() {
    this.lang = new MDCMenu(this.refs.lang)
  }

  render() {
    let download = null
    let startOver = null
    if (this.props.location !== '/') {
      startOver = (
        <button className="mdc-button mdc-button--raised toggle" onClick={() => {
          this.setState({showStartOver: true})
        }}>
          <i className="material-icons mdc-button__icon">replay</i> {i18n.startOver[this.props.language]}
        </button>)
      download = (<Download/>)
    }

    return [
      (<header key="header" className="mdc-toolbar mdc-elevation--z4 mdc-toolbar--fixed romajs-toolbar">
        <div className="mdc-toolbar__row">
          <section className="mdc-toolbar__section mdc-toolbar__section--align-start">
            <span className="mdc-toolbar__title">{i18n.title[this.props.language]}</span>
          </section>
          <section className="mdc-toolbar__section mdc-toolbar__section--align-end mdc-menu-surface--anchor" style={{right: '15px'}}>
            <button className="mdc-button mdc-button--raised toggle" onClick={(e) => {
              this.lang.open = !this.lang.open
              return e
            }}>
              <i className="material-icons mdc-button__icon">language</i> {i18n.language[this.props.language]} ({this.props.language})
            </button>
            <div className="mdc-menu mdc-menu-surface" tabIndex="-1" ref="lang">
              <ul className="mdc-list" role="menu" aria-hidden="true">
                <li className="mdc-list-item" role="menuitem" tabIndex="0" onClick={()=>{this.props.setLanguage('en')}}>English</li>
                <li className="mdc-list-item" role="menuitem" tabIndex="0" onClick={()=>{this.props.setLanguage('it')}}>Italiano</li>
              </ul>
            </div>
            {startOver}
            {download}
          </section>
        </div>
      </header>),
      (<YesNoDialog key="ynd" show={this.state.showStartOver} continue={() => {this.props.navigateTo('/')}}
        header={'Do you want to start over? All changes will be lost.'} hide={() => {
          this.setState({showStartOver: false})
        }}/>)
    ]
  }
}

Header.propTypes = {
  language: PropTypes.string.isRequired,
  location: PropTypes.string,
  navigateTo: PropTypes.func,
  setLanguage: PropTypes.func
}
