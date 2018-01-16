import React, { Component } from 'react'
import PropTypes from 'prop-types'
import YesNoDialog from './dialogs/YesNo'
import ModelClassPicker from '../containers/ModelClassPicker'
import AttClassPicker from '../containers/AttClassPicker'
import AceEditor from 'react-ace'
import Blockly from './Blockly'

import 'brace/mode/xml'
import 'brace/theme/tomorrow'

export default class Element extends Component {
  constructor(props) {
    super(props)
    this.state = {
      altIdent: props.element.altIdent,
      desc: props.element.desc,
      modelClasses: props.element.classes.model.slice(0).sort() || [],
      attClasses: props.element.classes.atts.slice(0).sort() || [],
      classDescs: props.element.classDescs || {},
      changed: false,
      isSaveDialogOpen: false
    }
    this.aceEditors = []
  }

  componentWillMount() {
    if (!this.props.success) {
      this.props.navigateTo('/')
    }
  }

  componentDidMount() {
    this.setupEditors()
  }

  componentDidUpdate(prevProps, prevState) {
    // Only setup editors again if the number of editors has changed
    if (prevState.desc.length !== this.state.desc.length) {
      this.setupEditors()
    }
    // Add from picker
    if (this.props.pickerItem) {
      if (this.props.pickerItem.type === 'models') {
        this.addModelClass(this.props.pickerItem.item.ident, this.props.pickerItem.item.shortDesc)
      } else if (this.props.pickerItem.type === 'attributes') {
        this.addAttClass(this.props.pickerItem.item.ident, this.props.pickerItem.item.shortDesc)
      }
      this.props.clearPicker()
    }
  }

  setupEditors = () => {
    for (const reactAceComponent of this.aceEditors) {
      const editor = reactAceComponent.editor
      editor.setOption('wrap', true)
      // TODO: this is for tinkering in browser, remove:
      // window.editor = editor
    }
  }

  changeDescEl = (text, el, pos) => {
    if (text !== this.state[el][pos]) {
      const newState = {changed: true}
      newState[el] = this.state[el].slice(0)
      newState[el][pos] = text
      this.setState(newState)
    }
  }

  removeDescEl = (el, pos, isAce = false) => {
    if (pos in this.state[el]) {
      const newState = {changed: true}
      newState[el] = this.state[el].slice(0)
      newState[el].splice(pos, 1)
      // Remove AceEditor if field supports it
      if (isAce) {
        this.aceEditors.splice(pos, 1)
      }
      this.setState(newState)
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
    if (this.state.changed) {
      this.setState({isSaveDialogOpen: true})
    } else {
      this.props.navigateTo('/members')
    }
  }

  save = (event) => {
    event.preventDefault()
    if (this.state.changed) {
      const altIdent = this.state.altIdent.filter((n) => { return n !== '' })
      const desc = this.state.desc.filter((n) => { return n !== '' })
      this.props.updateElementDocs(this.props.element.ident, 'altIdent', altIdent)
      this.props.updateElementDocs(this.props.element.ident, 'desc', desc)
      this.props.updateElementModelClasses(this.props.element.ident, this.state.modelClasses)
      this.props.updateElementAttributeClasses(this.props.element.ident, this.state.attClasses)
      this.setState({changed: false})
    }
  }

  render() {
    if (!this.props.success) {
      return null
    }
    let saveActive = ''
    if (this.state.changed) {
      saveActive = 'romajs-active'
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
        <span className={`mdl-chip mdl-chip--deletable romajs-clickable ${saveActive}`} onClick={this.save}>
          <span className="mdl-chip__text">Save changes</span>
          <span className="mdl-chip__action">
            <i className="material-icons">save</i>
          </span>
        </span>
      </section>
    </div>,
    <main key="main">
      <YesNoDialog
        label="Discard changes?"
        description="You have made some changes, are you sure you want to go back?"
        yes="Yes, Discard Changes"
        yesAction={() => this.props.navigateTo('/members')}
        no="Cancel"
        noAction={() => this.setState({isSaveDialogOpen: false})}
        show={this.state.isSaveDialogOpen}/>
      <div className="romajs-form">
        <h1 className="mdc-typography--headline">&lt;{this.props.element.ident}&gt;</h1>
        <div className="mdc-layout-grid">
          <div className="mdc-layout-grid__inner romajs-formrow">
            <div className="mdc-layout-grid__cell--span-3">
              <label>Alternative identifiers</label>
              <p className="mdc-text-field-helper-text mdc-text-field-helper-text--persistent">
                All documentation elements in ODD have a canonical name, supplied as the value for their ident attribute.
                <br/>The altIdent element is used to supply an alternative name for the corresponding XML object, perhaps in a different language.
              </p>
            </div>
            <div className="mdc-layout-grid__cell--span-8">{
              this.state.altIdent.map((ai, pos) => {
                return (<div key={`ai${pos}`}><div className="mdc-text-field mdc-text-field--upgraded">
                  <input autoFocus type="text" className="mdc-text-field__input" value={ai}
                    onChange={(e) => this.changeDescEl(e.target.value, 'altIdent', pos)}/>
                  <div className="mdc-text-field__bottom-line" style={{transformOrigin: '145px center'}}/>
                </div>
                <i className="material-icons romajs-clickable" onClick={() => { this.removeDescEl('altIdent', pos) }}>clear</i>
                </div>)
              })
            }
            <i className="material-icons romajs-clickable" onClick={() => {
              const altIdent = this.state.altIdent.slice(0)
              altIdent.push('')
              this.setState({altIdent})
            }}>add_circle_outline</i>
            </div>
          </div>
          <div className="mdc-layout-grid__inner romajs-formrow">
            <div className="mdc-layout-grid__cell--span-3">
              <label>Descriptions</label>
              <p className="mdc-text-field-helper-text mdc-text-field-helper-text--persistent">
                Contains a brief description of the object documented by its parent element, typically a documentation element or an entity.
              </p>
            </div>
            <div className="mdc-layout-grid__cell--span-8">{
              this.state.desc.map((d, pos) => {
                return (<div className="mdc-layout-grid__inner" key={`d${pos}`}>
                  <div className="mdc-layout-grid__cell--span-11">
                    <AceEditor
                      ref={(ae) => { ae ? this.aceEditors[pos] = ae : null }}
                      mode="xml"
                      theme="tomorrow"
                      name={`ace_desc${pos}`}
                      fontSize={14}
                      showPrintMargin={false}
                      showGutter={true}
                      highlightActiveLine={true}
                      value={d}
                      onChange={(text) => this.changeDescEl(text, 'desc', pos)}
                      height="100px"
                      width="80%"
                      editorProps={{
                        $blockScrolling: Infinity
                      }}/>
                  </div>
                  <div className="mdc-layout-grid__cell--span-1">
                    <i className="material-icons romajs-clickable" onClick={() => { this.removeDescEl('desc', pos, true) }}>clear</i>
                  </div>
                </div>)
              })
            }
            <div><i className="material-icons romajs-clickable" onClick={() => {
              const desc = this.state.desc.slice(0)
              desc.push('<desc xmlns="http://www.tei-c.org/ns/1.0" xml:lang="en"></desc>')
              this.setState({desc})
            }}>add_circle_outline</i></div>
            </div>
          </div>

          <div className="mdc-layout-grid__inner romajs-formrow">
            <div className="mdc-layout-grid__cell--span-3">
              <label>Classes</label>
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
                  <ModelClassPicker/>
                  <ul className="mdc-list mdc-list--two-line">{
                    this.state.modelClasses.map((c, pos) => {
                      return (<li key={`c${pos}`} className="mdc-list-item">
                        <span className="mdc-list-item__graphic">
                          <i className="material-icons romajs-clickable" onClick={() => this.removeModelClass(c)}>clear</i>
                        </span>
                        <span className="mdc-list-item__text">
                          {c}
                          <span className="mdc-list-item__secondary-text">
                            {this.state.classDescs[c]}
                          </span>
                        </span>
                      </li>)
                    })
                  }</ul>
                </div>
                <div className="mdc-layout-grid__cell--span-6 romajs-editable-list">
                  <label>Attributes</label>
                  <AttClassPicker/>
                  <ul className="mdc-list">{
                    this.state.attClasses.map((c, pos) => {
                      return (<li key={`c${pos}`} className="mdc-list-item">
                        <span className="mdc-list-item__graphic">
                          <i className="material-icons romajs-clickable" onClick={() => this.removeAttClass(c)}>clear</i>
                        </span>
                        <span className="mdc-list-item__text">
                          {c}
                          <span className="mdc-list-item__secondary-text">
                            {this.state.classDescs[c]}
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
              <Blockly elementContent={this.props.element.flattenedContent}/>
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
  pickerItem: PropTypes.object,
  navigateTo: PropTypes.func,
  clearPicker: PropTypes.func,
  updateElementDocs: PropTypes.func,
  updateElementModelClasses: PropTypes.func,
  updateElementAttributeClasses: PropTypes.func
}
