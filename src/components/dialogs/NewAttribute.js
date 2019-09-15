import React from 'react'
import PropTypes from 'prop-types'
import { Component } from 'react'
import { MDCDialog } from '@material/dialog'
import AttPicker from '../pickers/AttPicker'
import { clone } from '../../utils/clone'

export default class NewAttributeDialog extends Component {
  constructor(props) {
    super(props)
    this.defaultValue = 'newAttribute'
    this.state = {
      attribute: this.defaultValue,
      canCreate: true
    }
    this.dialog
  }

  componentDidMount() {
    this.dialog = new MDCDialog(this.refs.na)
    this.dialog.listen('MDCDialog:closed', (event) => {
      // NB default action needs to happen in all cases,
      // do not add breaks.
      switch (event.detail.action) {
        case 'add_attribute':
          this.props.add(this.state.attribute)
        case 'add_from_picker':
        case 'cancel':
        default:
          this.setState({attribute: this.defaultValue})
          this.props.hide()
          this.dialog.close()
      }
    })
    this.dialog.listen('MDCDialog:opened', () => {
      this.dialog.layout()
      if (this.props.associatedAttributes.indexOf(this.state.attribute) !== -1) {
        this.setState({canCreate: false})
      }
    })
  }

  componentDidUpdate() {
    if (this.props.show) {
      this.dialog.open()
    }
  }

  cloneAttribute(type, attribute) {
    const newAtt = clone(attribute)
    newAtt.onElement = true
    newAtt.mode = 'add'
    newAtt._isNew = true
    newAtt.clonedFrom = attribute.fromClass
    return newAtt
  }

  setAttribute(val) {
    if (val.length > 0) {
      this.setState({
        attribute: val,
        canCreate: true
      })
    } else {
      this.setState({
        attribute: this.defaultValue
      })
    }
    if (this.props.associatedAttributes.indexOf(val) !== -1) {
      this.setState({canCreate: false})
    }
    // test the localname
    let d = document.createElement('dummy')
    try {
      d.setAttribute(val, '')
    } catch (e) {
      this.setState({canCreate: false})
    }
    d = null
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
              Create new attribute
            </h2>
            <div className="mdc-dialog__content">
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
                      onChange={(e) => this.setAttribute(e.target.value)} placeholder={this.state.attribute}/>
                    <div className="mdc-text-field__bottom-line" style={{transformOrigin: '145px center'}}/>
                  </div>
                </div>
                <div className="mdc-layout-grid__cell--span-2">
                  <button className="mdc-button mdc-dialog__button" data-mdc-dialog-action="add_attribute" disabled={!this.state.canCreate}>
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
                  <AttPicker showAll items={this.props.items} pickerType={'attribute'} add={(t, a) => {
                    this.props.add(this.cloneAttribute(t, a))
                    this.props.hide()
                    this.dialog.close()
                  }} />
                </div>
              </div>
            </div>
            <footer className="mdc-dialog__actions">
              <button ref="cancelBtn" type="button" className="mdc-button mdc-dialog__button" data-mdc-dialog-action="cancel">
                Cancel
              </button>
            </footer>
          </div>
        </div>
        <div className="mdc-dialog__scrim"/>
      </aside>
    )
  }
}

NewAttributeDialog.propTypes = {
  show: PropTypes.bool.isRequired,
  items: PropTypes.array.isRequired,
  associatedAttributes: PropTypes.array.isRequired,
  add: PropTypes.func,
  hide: PropTypes.func,
  navigateToAttribute: PropTypes.func.isRequired
}
