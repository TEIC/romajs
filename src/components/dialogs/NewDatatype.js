import React from 'react'
import PropTypes from 'prop-types'
import { Component } from 'react'
import { MDCSelect } from '@material/select'
import { MDCDialog } from '@material/dialog'

export default class NewDatatype extends Component {
  constructor(props) {
    super(props)
    this.state = {
      canCreate: !this.doesDatatypeExist('datatype.new'),
      name: 'datatype.new',
      module: this.props.modules[0].ident
    }
    this.dialog
  }

  componentDidMount() {
    this.dialog = new MDCDialog(this.refs.na)
    this.dialog.listen('MDCDialog:closed', (event) => {
      switch (event.detail.action) {
        case 'add':
          this.props.createNewDatatype(this.state.name, this.state.module)
          this.setState({canCreate: false})
          this.props.hide()
          this.dialog.close()
          this.props.navigateTo(`/datatype/${this.state.name}`)
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
    const select = new MDCSelect(this.refs.module)
    select.listen('MDCSelect:change', () => {
      this.setState({module: select.value})
    })
    if (this.props.show) {
      this.dialog.open()
    }
  }

  componentDidUpdate() {
    if (this.props.show) {
      this.dialog.open()
    }
  }

  doesDatatypeExist(ident) {
    return this.props.allDatatypeIdents.indexOf(ident) > -1
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
              Create new Datatype
            </h2>
            <div className="mdc-dialog__content">
              <div className="mdc-layout-grid__inner romajs-formrow">
                <div className="mdc-layout-grid__cell--span-3">
                  <label>Name</label>
                  <p className="mdc-text-field-helper-text mdc-text-field-helper-text--persistent">
                    Set the new datatype's name.
                  </p>
                </div>
                <div className="mdc-layout-grid__cell--span-6">
                  <div className="mdc-text-field mdc-text-field--upgraded">
                    <input type="text" className="mdc-text-field__input" value={this.state.name}
                      onChange={(v) => {
                        if (this.doesDatatypeExist(v.target.value)) {
                          this.setState({name: v.target.value, canCreate: false})
                        } else {
                          this.setState({name: v.target.value, canCreate: true})
                        }
                      }}/>
                    <div className="mdc-text-field__bottom-line" style={{transformOrigin: '145px center'}}/>
                  </div>
                </div>
              </div>
              <div className="mdc-layout-grid__inner romajs-formrow">
                <div className="mdc-layout-grid__cell--span-3">
                  <label>Module</label>
                  <p className="mdc-text-field-helper-text mdc-text-field-helper-text--persistent">
                    Choose a module for this datatype.
                  </p>
                </div>
                <div className="mdc-layout-grid__cell--span-6">
                  <div className="mdc-select" ref="module">
                    <input type="hidden" name="enhanced-select"/>
                    <i className="mdc-select__dropdown-icon"/>
                    <div className="mdc-select__selected-text">{this.state.module}</div>
                    <div className="mdc-select__menu mdc-menu mdc-menu-surface" style={{zIndex: 99}}>
                      <ul className="mdc-list">{
                        this.props.modules.map((m, i) => {
                          return <li key={i} className="mdc-list-item" data-value={m.ident} tabIndex={i}> {m.ident} </li>
                        })
                      }</ul>
                    </div>
                    <div className="mdc-line-ripple"/>
                  </div>
                </div>
              </div>
            </div>
            <footer className="mdc-dialog__actions">
              <button type="button" className="mdc-button mdc-dialog__button" data-mdc-dialog-action="cancel">
                Cancel
              </button>
              <button type="button" className="mdc-button mdc-dialog__button" data-mdc-dialog-action="add"
                disabled={!this.state.canCreate}>
                Create
              </button>
            </footer>
          </div>
        </div>
        <div className="mdc-dialog__scrim"/>
      </aside>
    )
  }
}

NewDatatype.propTypes = {
  show: PropTypes.bool.isRequired,
  hide: PropTypes.func.isRequired,
  modules: PropTypes.array.isRequired,
  createNewDatatype: PropTypes.func.isRequired,
  allDatatypeIdents: PropTypes.array.isRequired,
  navigateTo: PropTypes.func.isRequired
}
