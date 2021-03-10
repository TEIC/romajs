import React from 'react'
import PropTypes from 'prop-types'
import { Component } from 'react'
import { MDCSelect } from '@material/select'
import { MDCDialog } from '@material/dialog'

export default class NewClass extends Component {
  constructor(props) {
    super(props)
    this.state = {
      canCreate: !this.doesClassExist('att.newClass'),
      name: 'att.newClass',
      module: this.props.oddname,
      classType: 'attributes'
    }
    this.dialog
  }

  componentDidMount() {
    this.dialog = new MDCDialog(this.refs.na)
    this.dialog.listen('MDCDialog:closed', (event) => {
      switch (event.detail.action) {
        case 'add':
          this.props.createNewClass(this.state.name, this.state.module, this.state.classType)
          this.setState({canCreate: false})
          this.props.hide()
          this.dialog.close()
          this.props.navigateTo(`/class/${this.state.name}`)
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

  doesClassExist(ident) {
    return this.props.allClassIdents.indexOf(ident) > -1
  }

  checkName(v) {
    if (this.doesClassExist(v)) {
      this.setState({name: v, canCreate: false})
    } else {
      // test the localname
      try {
        document.createElement(v)
        this.setState({name: v, canCreate: true})
      } catch (e) {
        this.setState({name: v, canCreate: false})
      }
    }
  }

  render() {
    const selectedTypeAttributes = this.state.classType === 'attributes' ? 'mdc-chip--selected' : null
    const selectedTypeModel = this.state.classType === 'models' ? 'mdc-chip--selected' : null
    return (
      <aside className="mdc-dialog"
        ref="na"
        role="alertdialog"
        aria-modal="true">
        <div className="mdc-dialog__container">
          <div className="mdc-dialog__surface">
            <h2 className="mdc-dialog__title">
              Create new Class
            </h2>
            <div className="mdc-dialog__content">
              <div className="mdc-layout-grid__inner romajs-formrow">
                <div className="mdc-layout-grid__cell--span-3">
                  <label>Class Type</label>
                  <p className="mdc-text-field-helper-text mdc-text-field-helper-text--persistent">
                    Choose a class type.
                  </p>
                </div>
                <div className="mdc-layout-grid__cell--span-9">
                  <div className="mdc-form-field">
                    <div className="mdc-chip-set mdc-chip-set--choice romajs-newClassForm">
                      <div className={`mdc-chip ${selectedTypeAttributes}`} tabIndex="0" onClick={() => {
                        this.setState({classType: 'attributes'})
                      }}>
                        <div className="mdc-chip__text">Attributes</div>
                      </div>
                      <div className={`mdc-chip ${selectedTypeModel}`} tabIndex="1" onClick={() => {
                        this.setState({classType: 'models'})
                      }}>
                        <div className="mdc-chip__text mdc-ripple-upgraded">Model</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mdc-layout-grid__inner romajs-formrow">
                <div className="mdc-layout-grid__cell--span-3">
                  <label>Name</label>
                  <p className="mdc-text-field-helper-text mdc-text-field-helper-text--persistent">
                    Set the new class name.
                  </p>
                </div>
                <div className="mdc-layout-grid__cell--span-6">
                  <div className="mdc-text-field mdc-text-field--upgraded">
                    <input type="text" className="mdc-text-field__input" value={this.state.name}
                      onChange={(v) => this.checkName(v.target.value)}/>
                    <div className="mdc-text-field__bottom-line" style={{transformOrigin: '145px center'}}/>
                  </div>
                </div>
              </div>
              <div className="mdc-layout-grid__inner romajs-formrow">
                <div className="mdc-layout-grid__cell--span-3">
                  <label>Module</label>
                  <p className="mdc-text-field-helper-text mdc-text-field-helper-text--persistent">
                    Choose a module for this class. NB: it is recommended to only add new elements
                    to modules defined in the customization.
                  </p>
                </div>
                <div className="mdc-layout-grid__cell--span-6">
                  <div className="mdc-select" ref="module">
                    <input type="hidden" name="enhanced-select"/>
                    <i className="mdc-select__dropdown-icon"/>
                    <div className="mdc-select__selected-text">{this.state.module}</div>
                    <div className="mdc-select__menu mdc-menu mdc-menu-surface" style={{zIndex: 99}}>
                      <ul className="mdc-list">{
                        [{ident: this.props.oddname}, ...this.props.modules].map((m, i) => {
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

NewClass.propTypes = {
  show: PropTypes.bool.isRequired,
  hide: PropTypes.func.isRequired,
  oddname: PropTypes.string.isRequired,
  modules: PropTypes.array.isRequired,
  createNewClass: PropTypes.func.isRequired,
  allClassIdents: PropTypes.array.isRequired,
  navigateTo: PropTypes.func.isRequired
}
