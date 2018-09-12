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
    this.dialog.listen('MDCDialog:accept', () => {
      this.props.continue()
      this.props.hide()
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
              {this.props.header}
            </h2>
          </header>
          <section className="mdc-dialog__body">
            <p className="mdc-typography--body2">
              {this.props.body}
            </p>
          </section>
          <footer className="mdc-dialog__footer">
            <button type="button" className="mdc-button mdc-dialog__footer__button mdc-dialog__footer__button--accept">
              Yes
            </button>
            <button ref="cancelBtn" type="button" className="mdc-button mdc-dialog__footer__button mdc-dialog__footer__button--cancel">
              No
            </button>
          </footer>
        </div>
        <div className="mdc-dialog__backdrop"/>
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
