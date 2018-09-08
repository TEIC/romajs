import React from 'react'
import PropTypes from 'prop-types'
import { Component } from 'react'
import Download from '../containers/Download'
import YesNoDialog from './dialogs/YesNo'

export default class Header extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showStartOver: false
    }
  }

  render() {
    let download = null
    let startOver = null
    if (this.props.location !== '/') {
      startOver = (
        <button className="mdc-button mdc-button--raised toggle" onClick={() => {
          this.setState({showStartOver: true})
        }}>
          <i className="material-icons mdc-button__icon">replay</i> Start Over
        </button>)
      download = (<Download/>)
    }

    return [
      (<header key="header" className="mdc-toolbar mdc-elevation--z4 mdc-toolbar--fixed romajs-toolbar">
        <div className="mdc-toolbar__row">
          <section className="mdc-toolbar__section mdc-toolbar__section--align-start">
            <span className="mdc-toolbar__title">Roma - ODD customization</span>
          </section>
          <section className="mdc-toolbar__section mdc-toolbar__section--align-end mdc-menu-anchor" style={{right: '15px'}}>
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
  location: PropTypes.string,
  navigateTo: PropTypes.func
}
