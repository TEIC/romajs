import React from 'react'
import PropTypes from 'prop-types'
import { Component } from 'react'
import { MDCSelect } from '@material/select'
import { MDCDialog } from '@material/dialog'

export default class NewElement extends Component {
  constructor(props) {
    super(props)
    this.state = {
      canCreate: !this.doesElementExist('newElement'),
      name: 'newElement',
      module: this.props.oddname,
      ns: this.props.ns || ''
    }
    this.dialog
  }

  componentDidMount() {
    console.log(this.props)
    this.dialog = new MDCDialog(this.refs.na)
    this.dialog.listen('MDCDialog:closed', (event) => {
      switch (event.detail.action) {
        case 'add':
          this.props.createNewElement(this.state.name, this.state.module, this.state.ns)
          this.setState({canCreate: false})
          this.props.hide()
          this.dialog.close()
          this.props.navigateTo(`/element/${this.state.name}`)
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

  doesElementExist(ident) {
    return this.props.allElementIdents.indexOf(ident) > -1
  }

  checkName(v) {
    if (this.doesElementExist(v)) {
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
    return (
      <aside className="mdc-dialog"
        ref="na"
        role="alertdialog"
        aria-modal="true">
        <div className="mdc-dialog__container">
          <div className="mdc-dialog__surface">
            <h2 className="mdc-dialog__title">
              Create new Element
            </h2>
            <div className="mdc-dialog__content">
              <div className="mdc-layout-grid__inner romajs-formrow">
                <div className="mdc-layout-grid__cell--span-3">
                  <label>Name</label>
                  <p className="mdc-text-field-helper-text mdc-text-field-helper-text--persistent">
                    Set the new element's name.
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
                    Choose a module for this element. NB: it is recommended to only add new elements
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
              <div className="mdc-layout-grid__inner romajs-formrow" key="namespace">
                <div className="mdc-layout-grid__cell--span-3">
                  <label>Namespace</label>
                  <p className="mdc-text-field-helper-text mdc-text-field-helper-text--persistent">
                    Set a namespace for a new element (it cannot be TEI's namespace).
                  </p>
                </div>
                <div className="mdc-layout-grid__cell--span-6">
                  <div className="mdc-text-field mdc-text-field--upgraded">
                    <input type="text" className="mdc-text-field__input" value={this.state.ns} onChange={(v) => {
                      this.setState({ns: v.target.value})
                    }}/>
                    <div className="mdc-text-field__bottom-line" style={{transformOrigin: '145px center'}}/>
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

NewElement.propTypes = {
  show: PropTypes.bool.isRequired,
  hide: PropTypes.func.isRequired,
  oddname: PropTypes.string.isRequired,
  modules: PropTypes.array.isRequired,
  createNewElement: PropTypes.func.isRequired,
  allElementIdents: PropTypes.array.isRequired,
  navigateTo: PropTypes.func.isRequired,
  ns: PropTypes.string
}
