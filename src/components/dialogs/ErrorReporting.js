import React from 'react'
import PropTypes from 'prop-types'
import { Component } from 'react'
import { MDCDialog } from '@material/dialog'

export default class ErrorReporting extends Component {
  constructor(props) {
    super(props)
    this.dialog
  }

  componentDidMount() {
    this.dialog = new MDCDialog(this.refs.na)
    this.dialog.listen('MDCDialog:accept', () => {
      // no-op
    })
    this.dialog.listen('MDCDialog:cancel', () => {
      this.props.hide()
    })
  }

  componentDidUpdate() {
    if (this.props.show) {
      this.dialog.show()
    }
  }

  render() {
    return (
      <aside
        ref="na"
        className="mdc-dialog"
        role="alertdialog"
        aria-labelledby="my-mdc-dialog-label"
        aria-describedby="my-mdc-dialog-description">
        <div className="mdc-dialog__surface">
          <header className="mdc-dialog__header">
            <h2 className="mdc-dialog__header__title">
              Oh-oh... Something went wrong
            </h2>
          </header>
          <section className="mdc-dialog__body">
            <p className="mdc-typography--body2">
              Roma JS is still in alpha. The following error occurred:
            </p>
            <pre>{this.props.error}</pre>
            <p className="mdc-typography--body2">
              Feel free to <a href="https://github.com/raffazizzi/romajs/issues">report an issue on GitHub</a>.
            </p>
          </section>
          <footer className="mdc-dialog__footer">
            <button ref="cancelBtn" type="button" className="mdc-button mdc-dialog__footer__button mdc-dialog__footer__button--cancel">
              OK
            </button>
          </footer>
        </div>
        <div className="mdc-dialog__backdrop"/>
      </aside>
    )
  }
}

ErrorReporting.propTypes = {
  show: PropTypes.bool.isRequired,
  hide: PropTypes.func,
  error: PropTypes.string
}
