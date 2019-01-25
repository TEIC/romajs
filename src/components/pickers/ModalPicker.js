import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Picker from './Picker'
import { MDCDialog } from '@material/dialog'

export default class ModalPicker extends Component {
  componentDidMount() {
    this.dialog = new MDCDialog(this.refs.picker)
    this.dialog.listen('MDCDialog:closed', (event) => {
      switch (event.detail.action) {
        case 'cancel':
          this.props.cancel()
        default:
          this.dialog.close()
      }
    })
  }

  componentDidUpdate() {
    if (this.props.visible) {
      this.dialog.open()
    }
  }

  addItem = (type, item) => {
    this.dialog.close()
    this.props.add(type, item)
  }

  render() {
    return (
      <aside className="mdc-dialog"
        ref="picker"
        role="alertdialog"
        aria-modal="true">
        <div className="mdc-dialog__container">
          <div className="mdc-dialog__surface">
            <div className="mdc-dialog__content">
              <Picker showAll items={this.props.items} pickerType={this.props.pickerType} add={this.addItem} />
              <div dangerouslySetInnerHTML={{__html: this.props.message}}/>
            </div>
            <footer className="mdc-dialog__actions">
              <button type="button" className="mdc-button mdc-dialog__button" data-mdc-dialog-action="cancel">
                <span className="mdc-button__label">Cancel</span>
              </button>
            </footer>
          </div>
        </div>
        <div className="mdc-dialog__scrim"/>
      </aside>)
  }
}

ModalPicker.propTypes = {
  visible: PropTypes.bool,
  items: PropTypes.array,
  pickerType: PropTypes.string,
  add: PropTypes.func,
  cancel: PropTypes.func,
  message: PropTypes.string
}
