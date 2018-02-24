import React, { Component } from 'react'
import PropTypes from 'prop-types'
import AltIdent from '../containers/AltIdentContainer'
import Desc from '../containers/DescContainer'
import ModelClassPicker from '../containers/ModelClassPicker'
import AttClassPicker from '../containers/AttClassPicker'
import BlocklyContainer from '../containers/BlocklyContainer'


export default class Element extends Component {
  constructor(props) {
    super(props)
    this.state = {
      modelClasses: props.element.classes.model.slice(0).sort() || [],
      attClasses: props.element.classes.atts.slice(0).sort() || [],
      classDescs: props.element.classDescs || {},
      changed: false
    }
  }

  componentWillMount() {
    if (!this.props.success) {
      this.props.navigateTo('/')
    }
  }

  removeClass = (className, type) => {
    const newState = {changed: true}
    newState[type] = this.state[type].filter((c) => {
      return c !== className
    })
    this.setState(newState)
  }

  addClass = (className, classDesc, type) => {
    const newState = {changed: true}
    const classes = new Set(this.state[type])
    classes.add(className)
    newState[type] = Array.from(classes).sort()
    newState.classDescs = Object.assign({}, this.state.classDescs)
    newState.classDescs[className] = classDesc
    this.setState(newState)
  }

  removeModelClass = (className) => {
    this.removeClass(className, 'modelClasses')
  }

  addModelClass = (className, classDesc) => {
    this.addClass(className, classDesc, 'modelClasses')
  }

  removeAttClass = (className) => {
    this.removeClass(className, 'attClasses')
  }

  addAttClass = (className, classDesc) => {
    this.addClass(className, classDesc, 'attClasses')
  }

  goBack = (event) => {
    event.preventDefault()
    this.props.navigateTo('/members')
  }

  render() {
    if (!this.props.success) {
      return null
    }
    return [<div key="toolbar" className="mdc-toolbar--fixed mdc-toolbar__row romajs-toolbar2">
      <section className="mdc-toolbar__section mdc-toolbar__section--align-start">
        <span className="mdl-chip mdl-chip--deletable romajs-clickable" onClick={this.goBack}>
          <span className="mdl-chip__text">Back</span>
          <span className="mdl-chip__action">
            <i className="material-icons">keyboard_arrow_left</i>
          </span>
        </span>
      </section>
      <section className="mdc-toolbar__section mdc-toolbar__section--align-end">
        <span className="mdl-chip mdl-chip--deletable">
          <span className="mdl-chip__text">Revert to source</span>
          <button type="button" className="mdl-chip__action">
            <i className="material-icons">undo</i>
          </button>
        </span>
      </section>
    </div>,
    <main key="main">
      <div className="romajs-form">
        <h1 className="mdc-typography--headline">&lt;{this.props.element.ident}&gt;</h1>
        <div className="mdc-layout-grid">
          <AltIdent element={this.props.element.ident} />
          <Desc element={this.props.element.ident} />
          <div className="mdc-layout-grid__inner romajs-formrow">
            <div className="mdc-layout-grid__cell--span-3">
              <label>Class Memberships</label>
              <p className="mdc-text-field-helper-text mdc-text-field-helper-text--persistent">
                Elements can be members of model classes (groups of elements) and attribute classes
                (to inherit the attributes defined in a class). <br/>
                Change class membership here.
              </p>
            </div>
            <div className="mdc-layout-grid__cell--span-8">
              <div className="mdc-layout-grid__inner">
                <div className="mdc-layout-grid__cell--span-6 romajs-editable-list">
                  <label>Models</label>
                  <ModelClassPicker element={this.props.element.ident}/>
                  <ul className="mdc-list mdc-list--two-line">{
                    this.props.element.classes.model.slice(0).sort().map((c, pos) => {
                      return (<li key={`c${pos}`} className="mdc-list-item">
                        <span className="mdc-list-item__graphic">
                          <i className="material-icons romajs-clickable" onClick={() =>
                            this.props.deleteElementModelClass(this.props.element.ident, c)}>clear</i>
                        </span>
                        <span className="mdc-list-item__text">
                          {c}
                          <span className="mdc-list-item__secondary-text">
                            {this.props.element.classDescs[c]}
                          </span>
                        </span>
                      </li>)
                    })
                  }</ul>
                </div>
                <div className="mdc-layout-grid__cell--span-6 romajs-editable-list">
                  <label>Attributes</label>
                  <AttClassPicker element={this.props.element.ident}/>
                  <ul className="mdc-list">{
                    this.props.element.classes.atts.slice(0).sort().map((c, pos) => {
                      return (<li key={`c${pos}`} className="mdc-list-item">
                        <span className="mdc-list-item__graphic">
                          <i className="material-icons romajs-clickable" onClick={() =>
                            this.props.deleteElementAttributeClass(this.props.element.ident, c)}>clear</i>
                        </span>
                        <span className="mdc-list-item__text">
                          {c}
                          <span className="mdc-list-item__secondary-text">
                            {this.props.element.classDescs[c]}
                          </span>
                        </span>
                      </li>)
                    })
                  }</ul>
                </div>
              </div>
            </div>
          </div>
          <div className="mdc-layout-grid__inner romajs-formrow">
            <div className="mdc-layout-grid__cell--span-3">
              <label>Content</label>
              <p className="mdc-text-field-helper-text mdc-text-field-helper-text--persistent">
                Edit element content
              </p>
            </div>
            <div className="mdc-layout-grid__cell--span-8">
              <BlocklyContainer element={this.props.element}/>
            </div>
          </div>
        </div>
      </div>
    </main>]
  }
}

Element.propTypes = {
  success: PropTypes.bool,
  element: PropTypes.object,
  navigateTo: PropTypes.func,
  clearPicker: PropTypes.func,
  deleteElementModelClass: PropTypes.func,
  deleteElementAttributeClass: PropTypes.func
}
