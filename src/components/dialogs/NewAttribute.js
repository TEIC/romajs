import React from 'react'
import PropTypes from 'prop-types'
import { Component } from 'react'
import { MDCDialog } from '@material/dialog'
import AttPicker from '../pickers/AttPicker'

export default class NewAttributeDialog extends Component {
  constructor(props) {
    super(props)
    this.state = {
      attribute: {}
    }
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

  cloneAttribute(type, attribute) {
    return {
      ident: attribute.ident,
      desc: attribute.desc,
      gloss: attribute.gloss,
      mode: 'add',
      ns: '',
      shortDesc: attribute.shortDesc,
      usage: attribute.usage
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
            <h2 id="my-mdc-dialog-label" className="mdc-dialog__header__title">
              Create new attribute
            </h2>
          </header>
          <section id="my-mdc-dialog-description" className="mdc-dialog__body">
            <div className="mdc-layout-grid__inner romajs-formrow">
              <div className="mdc-layout-grid__cell--span-3">
                <label>New</label>
                <p className="mdc-text-field-helper-text mdc-text-field-helper-text--persistent">
                  Create an entirely new attribute.
                </p>
              </div>
              <div className="mdc-layout-grid__cell--span-6">
                <div className="mdc-text-field mdc-text-field--upgraded">
                  <input type="text" className="mdc-text-field__input"
                    onChange={(e) => {this.setState({attribute: e.target.value})}} placeholder="newAttribute"/>
                  <div className="mdc-text-field__bottom-line" style={{transformOrigin: '145px center'}}/>
                </div>
              </div>
              <div className="mdc-layout-grid__cell--span-2">
                <button className="mdc-button" onClick={() => {
                  this.props.add(this.state.attribute)
                  this.refs.cancelBtn.click()
                }}>
                  Create
                </button>
              </div>
            </div>
            <div className="mdc-layout-grid__inner romajs-formrow">
              <div className="mdc-layout-grid__cell--span-3">
                <label>Copy</label>
                <p className="mdc-text-field-helper-text mdc-text-field-helper-text--persistent">
                  Duplicate an existing attribute.
                </p>
              </div>
              <div className="mdc-layout-grid__cell--span-8">
                <AttPicker showAll={true} items={this.props.items} pickerType={'attribute'} add={(t, a) => {
                  this.props.add(this.cloneAttribute(t, a))
                  this.refs.cancelBtn.click()
                }} />
              </div>
            </div>
          </section>
          <footer className="mdc-dialog__footer">
            <button ref="cancelBtn" type="button" className="mdc-button mdc-dialog__footer__button mdc-dialog__footer__button--cancel">
              Cancel
            </button>
          </footer>
        </div>
        <div className="mdc-dialog__backdrop"/>
      </aside>
    )
  }
}

NewAttributeDialog.propTypes = {
  show: PropTypes.bool.isRequired,
  items: PropTypes.array.isRequired,
  add: PropTypes.func,
  hide: PropTypes.func,
  navigateToAttribute: PropTypes.func.isRequired
}
