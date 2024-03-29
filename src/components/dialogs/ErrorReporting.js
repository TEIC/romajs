import React from 'react'
import PropTypes from 'prop-types'
import { Component } from 'react'
import { MDCDialog } from '@material/dialog'
import { _i18n } from '../../localization/i18n'

export default class ErrorReporting extends Component {
  constructor(props) {
    super(props)
    this.dialog
  }

  componentDidMount() {
    this.dialog = new MDCDialog(this.refs.na)
    this.dialog.listen('MDCDialog:closed', (event) => {
      switch (event.detail.action) {
        case 'restart':
          this.props.goHome()
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
    const i18n = _i18n(this.props.language, 'ErrorReporting')
    return (
      <aside className="mdc-dialog"
        ref="na"
        role="alertdialog"
        aria-modal="true">
        <div className="mdc-dialog__container">
          <div className="mdc-dialog__surface">
            <h2 className="mdc-dialog__title">
              {i18n('Oh-oh... Something went wrong')}
            </h2>
            <div className="mdc-dialog__content">
              <p className="mdc-typography--body2">
                {i18n('The following error occurred:')}
              </p>
              <pre>{this.props.error}</pre>
              <p className="mdc-typography--body2" dangerouslySetInnerHTML={{__html: i18n('report')}} />
            </div>
            <footer className="mdc-dialog__actions">
              <button type="button" className="mdc-button mdc-dialog__button" data-mdc-dialog-action="restart">
                {i18n('Start Over')}
              </button>
              <button type="button" className="mdc-button mdc-dialog__button" data-mdc-dialog-action="cancel">
                <span className="mdc-button__label">OK</span>
              </button>
            </footer>
          </div>
        </div>
        <div className="mdc-dialog__scrim"/>
      </aside>
    )
  }
}

ErrorReporting.propTypes = {
  show: PropTypes.bool.isRequired,
  hide: PropTypes.func,
  error: PropTypes.string,
  goHome: PropTypes.func,
  language: PropTypes.string.isRequired
}
