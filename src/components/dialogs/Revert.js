import React from 'react'
import PropTypes from 'prop-types'
import { Component } from 'react'
import { MDCDialog } from '@material/dialog'
import { _i18n } from '../../localization/i18n'

export default class Revert extends Component {
  constructor(props) {
    super(props)
    this.dialog
  }

  componentDidMount() {
    this.dialog = new MDCDialog(this.refs.rev)
    this.dialog.listen('MDCDialog:closed', (event) => {
      switch (event.detail.action) {
        case 'discard':
          this.props.discard(this.props.member)
          this.props.hide()
          this.dialog.close()
          break
        case 'revert':
          this.props.revert(this.props.member)
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
    const i18n = _i18n(this.props.language, 'Revert')
    let revertOption = null
    if (this.props.isNew) {
      revertOption = (
        <div className="mdc-layout-grid__inner romajs-formrow">
          <div className="mdc-layout-grid__cell--span-9">
            <label style={{fontWeight: 'bold'}}>{i18n('Revert to source (delete')} {this.props.memberLabel})</label>
            <p className="mdc-typography--body1">
              <span dangerouslySetInnerHTML={{__html: i18n('HelperText1')}}/>
              &nbsp;{this.props.memberLabel}&nbsp;
              <span dangerouslySetInnerHTML={{__html: i18n('HelperText2')}}/>
              <span dangerouslySetInnerHTML={{__html: i18n('HelperText3')}}/>
            </p>
          </div>
          <div className="mdc-layout-grid__cell--span-3">
            <button type="button" className="mdc-button mdc-dialog__button" data-mdc-dialog-action="revert">
              <span className="mdc-button__label">{i18n('Revert')}</span>
            </button>
          </div>
        </div>
      )
    } else {
      revertOption = (
        <div className="mdc-layout-grid__inner romajs-formrow">
          <div className="mdc-layout-grid__cell--span-9">
            <label style={{fontWeight: 'bold'}}>{i18n('Revert to source')}</label>
            <p className="mdc-typography--body1">
              <span dangerouslySetInnerHTML={{__html: i18n('HelperText1')}}/>
              &nbsp;{this.props.memberLabel}&nbsp;
              <span dangerouslySetInnerHTML={{__html: i18n('HelperText2')}}/>
            </p>
          </div>
          <div className="mdc-layout-grid__cell--span-3">
            <button type="button" className="mdc-button mdc-dialog__button" data-mdc-dialog-action="revert">
              <span className="mdc-button__label">{i18n('Revert')}</span>
            </button>
          </div>
        </div>
      )
    }
    return (
      <aside className="mdc-dialog"
        ref="rev"
        role="alertdialog"
        aria-modal="true">
        <div className="mdc-dialog__container">
          <div className="mdc-dialog__surface">
            <h2 className="mdc-dialog__title">
              {i18n('Revert changes')}
            </h2>
            <div className="mdc-dialog__content">
              <p className="mdc-typography--body1">{i18n('You have two options for reverting changes to')}&nbsp;<b>{this.props.memberLabel}</b></p>
              <div className="mdc-layout-grid__inner romajs-formrow">
                <div className="mdc-layout-grid__cell--span-9">
                  <label style={{fontWeight: 'bold'}}>{i18n('Discard latest changes')}</label>
                  <p className="mdc-typography--body1" dangerouslySetInnerHTML={{__html: i18n('HelperTextDiscard')}}/>
                </div>
                <div className="mdc-layout-grid__cell--span-3">
                  <button type="button" className="mdc-button mdc-dialog__button" data-mdc-dialog-action="discard">
                    <span className="mdc-button__label">{i18n('Discard')}</span>
                  </button>
                </div>
              </div>
              {revertOption}
            </div>
            <footer className="mdc-dialog__actions">
              <button type="button" className="mdc-button mdc-dialog__button" data-mdc-dialog-action="cancel">
                <span className="mdc-button__label">{i18n('Cancel')}</span>
              </button>
            </footer>
          </div>
        </div>
        <div className="mdc-dialog__scrim"/>
      </aside>
    )
  }
}

Revert.propTypes = {
  show: PropTypes.bool.isRequired,
  hide: PropTypes.func,
  memberLabel: PropTypes.string.isRequired,
  member: PropTypes.string.isRequired,
  isNew: PropTypes.bool.isRequired,
  discard: PropTypes.func.isRequired,
  revert: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired
}
