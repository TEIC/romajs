import React from 'react'
import PropTypes from 'prop-types'
import { Component } from 'react'
import SingleModule from '../containers/SingleModule'
import { Link } from 'react-router-dom'
import YesNoDialog from './dialogs/YesNo'
import { _i18n } from '../localization/i18n'

export default class Member extends Component {
  constructor(props) {
    super(props)
    this.state = { deleting: false }
  }

  render() {
    const i18n = _i18n(this.props.language, 'Member')
    let identLabel = this.props.ident
    if (this.props.highlight && this.props.highlight.length > 0) {
      const m = identLabel.toLowerCase().match(this.props.highlight.toLowerCase())
      if (m) {
        const s = identLabel.slice(0, m.index)
        const mid = identLabel.slice(m.index, m.index + m[0].length)
        const e = identLabel.slice(m.index + m[0].length)
        identLabel = <span>{s}<i style={{fontStyle: 'normal', backgroundColor: '#d2aa28'}}>{mid}</i>{e}</span>
      }
    }
    let ident = identLabel
    let location = ''
    let subType = ''
    switch (this.props.type) {
      case 'classes':
        location = 'class'
        subType = this.props.attributes ? 'attributes' : 'models'
        break
      case 'datatypes':
        location = 'datatype'
        subType = 'datatype'
        break
      default:
        location = 'element'
        subType = 'element'
    }
    if (this.props.selected) {
      ident = <Link to={`${location}/${this.props.ident}`}>{identLabel}</Link>
    }
    let dialog = <span/>
    if (this.state.deleting) {
      dialog = (<YesNoDialog key="ynd" show showImmediately continue={() => {
        this.props.toggleItem(this.props.ident, this.props.selected, subType, this.props.ns)
      }}
      header={i18n('q')}
      hide={() => {
        this.setState({deleting: false})
      }}
      language={this.props.language}/>)
    }

    const handleChange = () => {
      // Check whether excluding would result in a deletion and warn the user
      if (this.props.isNew && this.props.selected) {
        this.setState({deleting: true})
      } else {
        this.props.toggleItem(this.props.ident, this.props.selected, subType, this.props.ns)
      }
    }

    return (
      <li className="mdc-list-item mdc-elevation--z1">
        {dialog}
        <span className="mdc-checkbox">
          <input type="checkbox" id="basic-checkbox" className="mdc-checkbox__native-control" disabled={!this.props.selected && this.props.duplicate}
            checked={this.props.selected} onChange={handleChange}/>
          <span className="mdc-checkbox__background">
            <svg className="mdc-checkbox__checkmark" viewBox="0 0 24 24">
              <path className="mdc-checkbox__checkmark__path" fill="none" stroke="white" d="M1.73,12.91 8.1,19.28 22.79,4.59"/>
            </svg>
            <span className="mdc-checkbox__mixedmark"/>
          </span>
        </span>
        <span className="mdc-list-item__text">
          <span className="mdc-list-item__primary-text">{ident}{this.props.ns ? ` {${this.props.ns}}` : ''}</span>
          <span className="mdc-list-item__secondary-text">{(!this.props.selected && this.props.duplicate) && <span><strong>Roma does not support adding an element with the same ident as another one.</strong> || </span>}{this.props.shortDesc}
          </span>
        </span>
        <span className="mdc-list-item__end-detail">
          <SingleModule
            selected={this.props.module_selected}
            ident={this.props.module} />
        </span>
      </li>
    )
  }
}

Member.propTypes = {
  toggleItem: PropTypes.func.isRequired,
  selected: PropTypes.bool.isRequired,
  ident: PropTypes.string.isRequired,
  duplicate: PropTypes.bool.isRequired,
  ns: PropTypes.string,
  isNew: PropTypes.bool,
  shortDesc: PropTypes.string.isRequired,
  desc: PropTypes.array.isRequired,
  module: PropTypes.string.isRequired,
  module_selected: PropTypes.bool.isRequired,
  highlight: PropTypes.string,
  type: PropTypes.string.isRequired,
  attributes: PropTypes.array,
  language: PropTypes.string.isRequired
}
