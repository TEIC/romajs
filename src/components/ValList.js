import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { MDCSelect } from '@material/select'

export default class ValList extends Component {
  componentDidMount() {
    if (this.props.setValListType) {
      const select = new MDCSelect(this.refs.usage)
      switch (this.props.valList.type) {
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

  render() {
    let valItems = []
    if (this.props.valList) {
      if (this.props.valList.valItem) {
        valItems = this.props.valList.valItem
      }
    }

    let usage = null
    if (this.props.setValListType) {
      usage = (<div className="mdc-select" ref="usage">
        <input type="hidden" name="enhanced-select"/>
        <i className="mdc-select__dropdown-icon"/>
        <div className="mdc-select__selected-text"/>
        <div className="mdc-select__menu mdc-menu mdc-menu-surface">
          <ul className="mdc-list">
            <li className="mdc-list-item" data-value="" tabIndex={0}>
              Default (open)
            </li>
            <li className="mdc-list-item" data-value="closed" tabIndex={1}>
              Closed
            </li>
            <li className="mdc-list-item" data-value="semi" tabIndex={2}>
              Semi-Open
            </li>
            <li className="mdc-list-item" data-value="open" tabIndex={3}>
              Open
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
            <i className={`material-icons romajs-clickable`} onClick={() => {
              this.props.addValItem(this.refs.newValItem.value)
              this.refs.newValItem.value = ''
            }}>add_circle_outline</i>
            <div className="mdc-text-field mdc-text-field--upgraded">
              <input ref="newValItem" type="text" className="mdc-text-field__input" pattern="[^\s]+"/>
              <div className="mdc-text-field__bottom-line" style={{transformOrigin: '145px center'}}/>
            </div>
          </div>
        </div>,
        valItems.map(valItem => {
          return (<div key={valItem.ident} className="mdc-layout-grid__inner romajs-formrow">
            <div className="mdc-layout-grid__cell--span-4">
              <i className={`material-icons romajs-clickable`} onClick={() =>
                this.props.deleteValItem(valItem.ident)}>clear</i>
              {valItem.ident}</div>
            <div className="mdc-layout-grid__cell--span-8"/>
          </div>)
        })
      ]}</div>
    </div>)
  }
}

ValList.propTypes = {
  valList: PropTypes.object.isRequired,
  setValListType: PropTypes.func,
  deleteValItem: PropTypes.func.isRequired,
  addValItem: PropTypes.func.isRequired
}
