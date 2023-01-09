import React from 'react'
import PropTypes from 'prop-types'
import { Component } from 'react'
import Download from '../containers/Download'
import YesNoDialog from './dialogs/YesNo'
import { _i18n } from '../localization/i18n'
import { MDCMenu } from '@material/menu'
import RomaJSversion from '../utils/version'

export default class Header extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showStartOver: false,
      showLang: true
    }
  }

  componentDidMount() {
    this.lang = new MDCMenu(this.refs.lang)
  }

  render() {
    // Set language function
    const i18n = _i18n(this.props.language, 'Header')
    let download = null
    let startOver = null
    let settings = null
    let langBtn = null
    if (this.state.showLang) {
      langBtn = (<button className="mdc-button mdc-button--raised toggle" onClick={(e) => {
        this.lang.open = !this.lang.open
        return e
      }}>
        <i className="material-icons mdc-button__icon">language</i> {i18n('Language')} ({this.props.language})
      </button>)
    }
    if (this.props.location !== '/') {
      const isSettingsPage = this.props.location === '/settings'
      startOver = (
        <button className="mdc-button mdc-button--raised toggle" onClick={() => {
          this.setState({showStartOver: true})
        }}>
          <i className="material-icons mdc-button__icon">replay</i> {i18n('Start Over')}
        </button>)
      download = <Download/>
      settings = (<button className="mdc-button mdc-button--raised" disabled={isSettingsPage} onClick={() => this.props.navigateTo('/settings')}>
        <i className="material-icons mdc-button__icon">settings</i> {i18n('settings')}
      </button>)
    }

    let oddtitle
    if (this.props.oddtitle) {
      oddtitle = `(${this.props.oddtitle})`
    }

    return [
      (<header key="header" className="mdc-toolbar mdc-elevation--z4 mdc-toolbar--fixed romajs-toolbar">
        <div className="mdc-toolbar__row">
          <section className="mdc-toolbar__section mdc-toolbar__section--align-start">
            <span className="mdc-toolbar__title">{i18n('Roma - ODD Customization')} {oddtitle}</span>
            <span style={{position: 'absolute', top: '4em', fontSize: '70%', marginLeft: '24px'}}>
              v {RomaJSversion}
            </span>
          </section>
          <section className="mdc-toolbar__section mdc-toolbar__section--align-end mdc-menu-surface--anchor" style={{right: '15px'}}>
            {settings}
            {startOver}
            <div style={{position: 'relative'}}>
              {langBtn}
              <div style={{position: 'relative'}}>
                <div className="mdc-menu mdc-menu-surface" tabIndex="-1" ref="lang">
                  <ul className="mdc-list" role="menu" aria-hidden="true">
                    <li className="mdc-list-item" role="menuitem" tabIndex="0" onClick={()=>{
                      this.props.setLanguage('en')
                    }}>English</li>
                    <li className="mdc-list-item" role="menuitem" tabIndex="0" onClick={()=>{
                      this.props.setLanguage('fr')
                    }}>Français</li>
                    <li className="mdc-list-item" role="menuitem" tabIndex="0" onClick={()=>{
                      this.props.setLanguage('it')
                    }}>Italiano</li>
                  </ul>
                </div>
              </div>
            </div>
            {download}
          </section>
        </div>
      </header>),
      (<YesNoDialog key="ynd" show={this.state.showStartOver} continue={() => {this.props.navigateTo('/')}}
        header={i18n('Do you want to start over? All changes will be lost.')} hide={() => {
          this.setState({showStartOver: false})
        }} language={this.props.language}/>),
      (<YesNoDialog key="lang" show={false} continue={() => {console.log('applying settings')}}
        header={i18n('Do you want to apply this language to elements, attributes, and documentation as well?')} hide={() => {
          this.setState({showLang: false})
        }} language={this.props.language}/>)
    ]
  }
}

Header.propTypes = {
  language: PropTypes.string.isRequired,
  location: PropTypes.string,
  navigateTo: PropTypes.func,
  setLanguage: PropTypes.func,
  oddtitle: PropTypes.string
}
