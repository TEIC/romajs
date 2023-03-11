import React, { Component } from 'react'
import PropTypes from 'prop-types'
import AltIdent from '../containers/EditAttributeAltIdent'
import Desc from '../containers/EditAttributeDesc'
import ValList from './ValList'
import AttDatatype from './AttDatatype'
import { MDCSelect } from '@material/select'
import { _i18n } from '../localization/i18n'

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
    if (!this.props.success) {
      this.props.navigateTo(`/${this.props.memberType}/${this.props.member.ident}/attributes`)
      return null
    }
    const i18n = _i18n(this.props.language, 'Attribute')
    return (<div className="mdc-layout-grid">
      <div className="mdc-layout-grid__inner romajs-formrow">
        <div className="mdc-layout-grid__cell--span-3">
          <label>{i18n('Usage')}</label>
          <p className="mdc-text-field-helper-text mdc-text-field-helper-text--persistent"
            dangerouslySetInnerHTML={{__html: i18n('HelperText')}} />
        </div>
        <div className="mdc-layout-grid__cell--span-8">
          <div className="mdc-select" ref="usage">
            <input type="hidden" name="enhanced-select"/>
            <i className="mdc-select__dropdown-icon"/>
            <div className="mdc-select__selected-text"/>
            <div className="mdc-select__menu mdc-menu mdc-menu-surface">
              <ul className="mdc-list">
                <li className="mdc-list-item" data-value="opt" tabIndex={0}>
                  {i18n('Default (optional)')}
                </li>
                <li className="mdc-list-item" data-value="req" tabIndex={1}>
                  {i18n('Required')}
                </li>
                <li className="mdc-list-item" data-value="rec" tabIndex={2}>
                  {i18n('Recommended')}
                </li>
                <li className="mdc-list-item" data-value="opt" tabIndex={3}>
                  {i18n('Optional')}
                </li>
              </ul>
            </div>
            <div className="mdc-line-ripple"/>
          </div>
        </div>
      </div>
      <Desc member={this.props.member} memberType={this.props.memberType} attribute={this.props.attribute} language={this.props.language} />
      <Desc member={this.props.member} memberType={this.props.memberType} attribute={this.props.attribute} valDesc language={this.props.language}/>
      <div className="mdc-layout-grid__inner romajs-formrow">
        <div className="mdc-layout-grid__cell--span-3">
          <label>{i18n('Values')}</label>
          <p className="mdc-text-field-helper-text mdc-text-field-helper-text--persistent"
            dangerouslySetInnerHTML={{__html: i18n('HelperTextValues')}} />
        </div>
        <div className="mdc-layout-grid__cell--span-8">
          <ValList
            language={this.props.language}
            attribute={this.props.attribute}
            member={this.props.member}
            memberType={this.props.memberType}
            setValListType={this.props.setValListType} addValItem={this.props.addValItem}
            deleteValItem={this.props.deleteValItem} />
        </div>
      </div>
      <AttDatatype member={this.props.member} memberType={this.props.memberType} attribute={this.props.attribute}
        setDataTypeRestriction={this.props.setDataTypeRestriction} language={this.props.language} />
      <AltIdent member={this.props.member} memberType={this.props.memberType} attribute={this.props.attribute} language={this.props.language} />
      <div className="mdc-layout-grid__inner romajs-formrow">
        <div className="mdc-layout-grid__cell--span-3">
          <label>{i18n('Namespace')}</label>
          <p className="mdc-text-field-helper-text mdc-text-field-helper-text--persistent"
            dangerouslySetInnerHTML={{__html: i18n('HelperTextNs')}} />
        </div>
        <div className="mdc-layout-grid__cell--span-8">
          <div className="mdc-text-field mdc-text-field--upgraded mdc-text-field--fullwidth">
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
  setDataTypeRestriction: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired,
  success: PropTypes.bool.isRequired,
  navigateTo: PropTypes.func.isRequired,
}
