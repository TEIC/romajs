import React from 'react'
import PropTypes from 'prop-types'
import { Component } from 'react'
import { MDCDialog } from '@material/dialog'

export default class YesNoDialog extends Component {
  componentDidUpdate() {
    if (this.refs.yn) {
      const dialog = new MDCDialog(this.refs.yn)
      dialog.show()
      if (this.props.yesAction) {
        dialog.listen('MDCDialog:accept', () => {
          // TODO: this can't be right. How to fix?
          document.querySelector('body').classList.remove('mdc-dialog-scroll-lock')
          this.props.yesAction()
        })
      }
      if (this.props.noAction) {
        dialog.listen('MDCDialog:cancel', () => {
          // TODO: this can't be right. How to fix?
          document.querySelector('body').classList.remove('mdc-dialog-scroll-lock')
          this.props.noAction()
        })
      }
    }
  }

  render() {
    if (!this.props.show) {
      return null
    }
    return (
      <aside
        ref="yn"
        id="my-mdc-dialog"
        className="mdc-dialog"
        role="alertdialog"
        aria-labelledby="my-mdc-dialog-label"
        aria-describedby="my-mdc-dialog-description">
        <div className="mdc-dialog__surface">
          <header className="mdc-dialog__header">
            <h2 id="my-mdc-dialog-label" className="mdc-dialog__header__title">
              {this.props.label}
            </h2>
          </header>
          <section id="my-mdc-dialog-description" className="mdc-dialog__body">
            {this.props.description}
          </section>
          <footer className="mdc-dialog__footer">
            <button type="button" className="mdc-button mdc-dialog__footer__button mdc-dialog__footer__button--cancel">
              {this.props.no ? this.props.no : 'No'}
            </button>
            <button type="button" className="mdc-button mdc-dialog__footer__button mdc-dialog__footer__button--accept">
              {this.props.yes ? this.props.yes : 'Yes'}
            </button>
          </footer>
        </div>
        <div className="mdc-dialog__backdrop"/>
      </aside>
    )
  }
}

YesNoDialog.propTypes = {
  show: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  yes: PropTypes.string,
  yesAction: PropTypes.func,
  no: PropTypes.string,
  noAction: PropTypes.func
}
