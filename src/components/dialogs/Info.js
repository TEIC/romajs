import React from 'react'
import PropTypes from 'prop-types'
import { Component } from 'react'
import { MDCDialog } from '@material/dialog'
import ReactDOM from 'react-dom'

export default class Info extends Component {
  constructor(props) {
    super(props)
    this.el = document.createElement('div')
    this.dialog
  }

  componentDidMount() {
    document.body.appendChild(this.el)
    this.dialog = new MDCDialog(this.refs.na)
    this.dialog.listen('MDCDialog:closed', () => {
      this.props.hide()
      this.dialog.close()
    })
    this.dialog.listen('MDCDialog:opened', () => {
      this.dialog.layout()
    })
    if (this.props.showImmediately) {
      this.dialog.open()
    }
  }

  componentDidUpdate() {
    if (this.props.show) {
      this.dialog.open()
    }
  }

  componentWillUnmount() {
    document.body.removeChild(this.el)
  }

  render() {
    return ReactDOM.createPortal(
      (<aside className="mdc-dialog"
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
                <span className="mdc-button__label">OK</span>
              </button>
            </footer>
          </div>
        </div>
        <div className="mdc-dialog__scrim"/>
      </aside>),
      this.el
    )
  }
}

Info.propTypes = {
  show: PropTypes.bool.isRequired,
  showImmediately: PropTypes.bool,
  hide: PropTypes.func,
  header: PropTypes.string.isRequired,
  body: PropTypes.string
}
