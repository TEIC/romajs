import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ValItem from './ValItem'
import { MDCSelect } from '@material/select'
import { _i18n } from '../localization/i18n'

export default class ValList extends Component {
  componentDidMount() {
    const valList = this.props.memberType === 'dt'
      ? this.props.valList
      : this.props.attribute.valList || {}
    if (this.props.setValListType) {
      const select = new MDCSelect(this.refs.usage)
      switch (valList.type) {
        case '':
          select.foundation_.setSelectedIndex(0)
          break
        case 'closed':
          select.foundation_.setSelectedIndex(1)
          break
        case 'semi':
          select.foundation_.setSelectedIndex(2)
          break
        case 'open':
          select.foundation_.setSelectedIndex(3)
          break
        default:
          select.foundation_.setSelectedIndex(0)
      }
      select.listen('MDCSelect:change', () => {
        this.props.setValListType(select.value)
      })
    }
  }

  addNew = () => {
    this.props.addValItem(this.refs.newValItem.value)
    this.refs.newValItem.value = ''
  }

  render() {
    const i18n = _i18n(this.props.language, 'ValList')
    const valList = this.props.memberType === 'dt'
      ? this.props.valList
      : this.props.attribute.valList || {}
    let valItems = []
    if (valList) {
      if (valList.valItem) {
        valItems = Array.from(valList.valItem)
      }
    }
    valItems.sort((a, b) => {
      if (a.ident.toLowerCase() > b.ident.toLowerCase()) {
        return 1
      } else {
        return 0
      }
    })

    let usage = null
    if (this.props.setValListType) {
      usage = (<div className="mdc-select" ref="usage">
        <input type="hidden" name="enhanced-select"/>
        <i className="mdc-select__dropdown-icon"/>
        <div className="mdc-select__selected-text"/>
        <div className="mdc-select__menu mdc-menu mdc-menu-surface">
          <ul className="mdc-list">
            <li className="mdc-list-item" data-value="" tabIndex={0}>
              {i18n('Default (open)')}
            </li>
            <li className="mdc-list-item" data-value="closed" tabIndex={1}>
              {i18n('Closed')}
            </li>
            <li className="mdc-list-item" data-value="semi" tabIndex={2}>
              {i18n('Semi-Open')}
            </li>
            <li className="mdc-list-item" data-value="open" tabIndex={3}>
              {i18n('Open')}
            </li>
          </ul>
        </div>
        <div className="mdc-line-ripple"/>
      </div>)
    }

    return (<div>
      {usage}
      <div className="mdc-layout-grid">{[
        <div key="add" className="mdc-layout-grid__inner">
          <div className="mdc-layout-grid__cell--span-12">
            <div className="mdc-text-field mdc-text-field--upgraded">
              <input ref="newValItem" type="text" className="mdc-text-field__input" pattern="[^\s]+"/>
              <div className="mdc-text-field__bottom-line" style={{transformOrigin: '145px center'}}/>
            </div>
            <i className={`material-icons romajs-clickable`} tabIndex={0}
              onClick={this.addNew}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && this.addNew()}
            >add_circle_outline</i>
          </div>
        </div>,
        valItems.map(valItem => {
          return (<ValItem key={valItem.ident}
            language={this.props.language}
            valItem={valItem}
            member={this.props.member}
            memberType={this.props.memberType}
            attribute={this.props.attribute}
            deleteValItem={this.props.deleteValItem}/>)
        })
      ]}</div>
    </div>)
  }
}

ValList.propTypes = {
  member: PropTypes.object.isRequired,
  memberType: PropTypes.string.isRequired,
  attribute: PropTypes.object,
  valList: PropTypes.object,
  setValListType: PropTypes.func,
  deleteValItem: PropTypes.func.isRequired,
  addValItem: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired
}
