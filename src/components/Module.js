import React, { Component } from 'react'
import PropTypes from 'prop-types'
import YesNoDialog from './dialogs/YesNo'
import { _i18n } from '../localization/i18n'

export default class Module extends Component {
  constructor(props) {
    super(props)
    this.state = { deleting: false }
  }

  toggle() {
    this.props.toggleModule(this.props.ident, this.props.selected)
  }

  render() {
    const i18n = _i18n(this.props.language, 'Module')
    let dialog = <span/>
    if (this.state.deleting) {
      dialog = (<YesNoDialog key="ynd" show showImmediately continue={() => {
        this.toggle()
      }}
      header={i18n('q')}
      hide={() => {
        this.setState({deleting: false})
      }}
      language={this.props.language}/>)
    }
    const iconClass = this.props.selected ? 'romajs-color-no' : 'romajs-color-yes'
    const iconType = this.props.selected ? 'cancel' : 'add_circle'
    return (<div>{dialog}<div key="chip" className="mdc-chip" tabIndex={0} onClick={() => {
      this.props.selected ? this.setState({deleting: true}) : this.toggle()
    }} onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        this.props.selected ? this.setState({deleting: true}) : this.toggle()
      }
    }}>
      <i className={`material-icons mdc-chip__icon mdc-chip__icon--leading ${iconClass}`}>{iconType}</i>
      <div className="mdc-chip__text"> ({this.props.ident})</div>
    </div></div>)
  }
}

Module.propTypes = {
  toggleModule: PropTypes.func.isRequired,
  ident: PropTypes.string.isRequired,
  selected: PropTypes.bool.isRequired,
  language: PropTypes.string.isRequired
}
