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
      this.props.setUsage(select.value)
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
          <div className="mdc-select" ref="usage">
            <input type="hidden" name="enhanced-select"/>
            <i className="mdc-select__dropdown-icon"/>
            <div className="mdc-select__selected-text"/>
            <div className="mdc-select__menu mdc-menu mdc-menu-surface">
              <ul className="mdc-list">
                <li className="mdc-list-item" data-value="opt" tabIndex={0}>
                  Default (optional)
                </li>
                <li className="mdc-list-item" data-value="req" tabIndex={1}>
                  Required
                </li>
                <li className="mdc-list-item" data-value="rec" tabIndex={2}>
                  Recommended
                </li>
                <li className="mdc-list-item" data-value="opt" tabIndex={3}>
                  Optional
                </li>
              </ul>
            </div>
            <div className="mdc-line-ripple"/>
          </div>
        </div>
      </div>
      <Desc member={this.props.member} memberType={this.props.memberType} attribute={this.props.attribute} />
      <Desc member={this.props.member} memberType={this.props.memberType} attribute={this.props.attribute} valDesc/>
      <div className="mdc-layout-grid__inner romajs-formrow">
        <div className="mdc-layout-grid__cell--span-3">
          <label>Values</label>
          <p className="mdc-text-field-helper-text mdc-text-field-helper-text--persistent">
            Set values for this attribute.
          </p>
        </div>
        <div className="mdc-layout-grid__cell--span-8">
          <ValList
            valList={this.props.attribute.valList || {}}
            setValListType={this.props.setValListType} addValItem={this.props.addValItem}
            deleteValItem={this.props.deleteValItem} />
        </div>
      </div>
      <AttDatatype member={this.props.member} memberType={this.props.memberType} attribute={this.props.attribute}
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
