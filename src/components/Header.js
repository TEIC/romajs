import React from 'react'
import PropTypes from 'prop-types'
import { Component } from 'react'
import Download from '../containers/Download'

export default class Header extends Component {
  render() {
    let download = null
    if (this.props.location !== '/') {
      download = (<Download/>)
    }

    return (
      <header className="mdc-toolbar mdc-elevation--z4 mdc-toolbar--fixed romajs-toolbar">
        <div className="mdc-toolbar__row">
          <section className="mdc-toolbar__section mdc-toolbar__section--align-start">
            <span className="mdc-toolbar__title">Roma - ODDs customization</span>
          </section>
          {download}
        </div>
      </header>
    )
  }
}

Header.propTypes = {
  location: PropTypes.string
}
