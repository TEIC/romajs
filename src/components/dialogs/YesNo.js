import React from 'react'
import PropTypes from 'prop-types'
import { Component } from 'react'
import { MDCDialog } from '@material/dialog'

export default class YesNo extends Component {
  constructor(props) {
    super(props)
    this.dialog
  }

  componentDidMount() {
    this.dialog = new MDCDialog(this.refs.na)
    this.dialog.listen('MDCDialog:closed', (event) => {
      switch (event.detail.action) {
        case 'accept':
          this.props.continue()
          this.props.hide()
          this.dialog.close()
          break
        case 'cancel':
        default:
          this.props.hide()
          this.dialog.close()
      }
    })
    this.dialog.listen('MDCDialog:opened', () => {
      this.dialog.layout()
    })
  }

  componentDidUpdate() {
    if (this.props.show) {
      this.dialog.open()
    }
  }

  render() {
    return (
      <aside className="mdc-dialog"
        ref="na"
        role="alertdialog"
        aria-modal="true">
        <div className="mdc-dialog__container">
          <div className="mdc-dialog__surface">
            <h2 className="mdc-dialog__title">
              {this.props.header}
            </h2>
            <div className="mdc-dialog__content">
              {this.props.body}
            </div>
            <footer className="mdc-dialog__actions">
              <button type="button" className="mdc-button mdc-dialog__button" data-mdc-dialog-action="cancel">
                <span className="mdc-button__label">No</span>
              </button>
              <button type="button" className="mdc-button mdc-dialog__button" data-mdc-dialog-action="accept">
                <span className="mdc-button__label">Yes</span>
              </button>
            </footer>
          </div>
        </div>
        <div className="mdc-dialog__scrim"/>
      </aside>
    )
  }
}

YesNo.propTypes = {
  show: PropTypes.bool.isRequired,
  hide: PropTypes.func,
  header: PropTypes.string.isRequired,
  body: PropTypes.string,
  continue: PropTypes.func.isRequired
}
