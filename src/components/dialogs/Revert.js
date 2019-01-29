import React from 'react'
import PropTypes from 'prop-types'
import { Component } from 'react'
import { MDCDialog } from '@material/dialog'

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
          console.log('r')
          this.props.hide()
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
    let revertOption = null
    if (this.props.isNew) {
      // noop
    } else {
      revertOption = (
        <div className="mdc-layout-grid__inner romajs-formrow">
          <div className="mdc-layout-grid__cell--span-9">
            <label style={{fontWeight: 'bold'}}>Revert to source</label>
            <p className="mdc-typography--body1">
              Discard <i>all</i> changes to {this.props.memberLabel} and revert
              to its original definition.
            </p>
          </div>
          <div className="mdc-layout-grid__cell--span-3">
            <button type="button" className="mdc-button mdc-dialog__button" data-mdc-dialog-action="revert">
              <span className="mdc-button__label">Revert</span>
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
              Revert changes
            </h2>
            <div className="mdc-dialog__content">
              <p className="mdc-typography--body1">You have two options for reverting changes to <b>{this.props.memberLabel}</b></p>
              <div className="mdc-layout-grid__inner romajs-formrow">
                <div className="mdc-layout-grid__cell--span-9">
                  <label style={{fontWeight: 'bold'}}>Discard latest changes</label>
                  <p className="mdc-typography--body1">
                    Discard changes you have made in Roma in this session.
                    This item will return to same settings as the customization you picked or uploaded.
                  </p>
                </div>
                <div className="mdc-layout-grid__cell--span-3">
                  <button type="button" className="mdc-button mdc-dialog__button" data-mdc-dialog-action="discard">
                    <span className="mdc-button__label">Discard</span>
                  </button>
                </div>
              </div>
              {revertOption}
            </div>
            <footer className="mdc-dialog__actions">
              <button type="button" className="mdc-button mdc-dialog__button" data-mdc-dialog-action="cancel">
                <span className="mdc-button__label">Cancel</span>
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
  discard: PropTypes.func.isRequired
}
