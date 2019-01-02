import React, { Component } from 'react'
import PropTypes from 'prop-types'
import AltIdent from '../containers/EditAttributeAltIdent'
import Desc from '../containers/EditAttributeDesc'
import ValList from './ValList'
import AttDatatype from './AttDatatype'
import { MDCSelect } from '@material/select'

export default class Attribute extends Component {
  componentDidMount() {
    const select = new MDCSelect(this.refs.usage)
    switch (this.props.attribute.usage) {
      case 'def':
        select.foundation_.setSelectedIndex(0)
        break
      case 'req':
        select.foundation_.setSelectedIndex(1)
        break
      case 'rec':
        select.foundation_.setSelectedIndex(2)
        break
      case 'opt':
        select.foundation_.setSelectedIndex(3)
        break
      default:
        select.foundation_.setSelectedIndex(0)
    }
    select.listen('MDCSelect:change', () => {
      let value = 'def'
      switch (select.value) {
        case 'Default (optional)':
          value = 'def'
          break
        case 'Required':
          value = 'req'
          break
        case 'Recommended':
          value = 'rec'
          break
        case 'Optional':
          value = 'opt'
          break
        default:
          value = 'def'
      }
      this.props.setUsage(value)
    })
  }

  render() {
    return (<div className="mdc-layout-grid">
      <div className="mdc-layout-grid__inner romajs-formrow">
        <div className="mdc-layout-grid__cell--span-3">
          <label>Usage</label>
          <p className="mdc-text-field-helper-text mdc-text-field-helper-text--persistent">
            Set attribute usage.
          </p>
        </div>
        <div className="mdc-layout-grid__cell--span-8">
          <div className="mdc-select" role="listbox" ref="usage">
            <div className="mdc-select__surface" tabIndex="0">
              <div className="mdc-select__label"/>
              <div className="mdc-select__selected-text"/>
              <div className="mdc-select__bottom-line"/>
            </div>
            <div className="mdc-menu mdc-select__menu">
              <ul className="mdc-list mdc-menu__items">
                <li className="mdc-list-item" role="option" tabIndex="0">
                  Default (optional)
                </li>
                <li className="mdc-list-item" role="option" tabIndex="1">
                  Required
                </li>
                <li className="mdc-list-item" role="option" tabIndex="2">
                  Recommended
                </li>
                <li className="mdc-list-item" role="option" tabIndex="3">
                  Optional
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Desc member={this.props.member} memberType={this.props.memberType} attribute={this.props.attribute} />
      <Desc member={this.props.member} memberType={this.props.memberType} attribute={this.props.attribute} valDesc={true}/>
      <ValList
        member={this.props.member} attribute={this.props.attribute}
        setValListType={this.props.setValListType} addValItem={this.props.addValItem}
        deleteValItem={this.props.deleteValItem} />
      <AttDatatype member={this.props.member} attribute={this.props.attribute}
        setDataTypeRestriction={this.props.setDataTypeRestriction}/>
      <AltIdent member={this.props.member} memberType={this.props.memberType} attribute={this.props.attribute} />
      <div className="mdc-layout-grid__inner romajs-formrow">
        <div className="mdc-layout-grid__cell--span-3">
          <label>Namespace</label>
          <p className="mdc-text-field-helper-text mdc-text-field-helper-text--persistent">
            Set a namespace for this attribute. Leave empty for null namespace.
          </p>
        </div>
        <div className="mdc-layout-grid__cell--span-8">
          <div className="mdc-text-field mdc-text-field--upgraded">
            <input type="text" className="mdc-text-field__input" value={this.props.attribute.ns}
              onChange={(e) => this.props.setNs(e.target.value)} placeholder="(null)"/>
            <div className="mdc-text-field__bottom-line" style={{transformOrigin: '145px center'}}/>
          </div>
        </div>
      </div>
    </div>)
  }
}

Attribute.propTypes = {
  member: PropTypes.object.isRequired,
  memberType: PropTypes.string.isRequired,
  attribute: PropTypes.object.isRequired,
  setNs: PropTypes.func.isRequired,
  setUsage: PropTypes.func.isRequired,
  setValListType: PropTypes.func.isRequired,
  addValItem: PropTypes.func.isRequired,
  deleteValItem: PropTypes.func.isRequired,
  setDataTypeRestriction: PropTypes.func.isRequired
}
