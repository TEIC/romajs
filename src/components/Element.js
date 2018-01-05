import React, { Component } from 'react'
import PropTypes from 'prop-types'
import YesNoDialog from './dialogs/YesNo'
import AceEditor from 'react-ace'

import 'brace/mode/xml'
import 'brace/theme/tomorrow'

export default class Element extends Component {
  constructor(props) {
    super(props)
    this.state = {
      altIdent: props.element.altIdent,
      desc: props.element.desc,
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
  }

  setupEditors = () => {
    for (const reactAceComponent of this.aceEditors) {
      const editor = reactAceComponent.editor
      editor.setOption('wrap', true)
      // This is for testing in browser, remove:
      // window.editor = editor
    }
  }

  changeDescEl = (text, el, pos) => {
    if (text !== this.state[el][pos]) {
      this.setState({changed: true})
      const newState = {}
      newState[el] = this.state[el].slice(0)
      newState[el][pos] = text
      this.setState(newState)
    }
  }

  removeDescEl = (el, pos) => {
    if (pos in this.state[el]) {
      this.setState({changed: true})
      const newState = {}
      newState[el] = this.state[el].slice(0)
      newState[el].splice(pos, 1)
      this.setState(newState)
    }
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
          <span className="mdl-chip__text">Revert to original</span>
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
              <p className="mdc-textfield-helptext mdc-textfield-helptext--persistent">
                All documentation elements in ODD have a canonical name, supplied as the value for their ident attribute.
                <br/>The altIdent element is used to supply an alternative name for the corresponding XML object, perhaps in a different language.
              </p>
            </div>
            <div className="mdc-layout-grid__cell--span-8">{
              this.state.altIdent.map((ai, pos) => {
                return (<div key={`ai${pos}`}><div className="mdc-textfield mdc-textfield--upgraded">
                  <input autoFocus type="text" className="mdc-textfield__input" value={ai}
                    onChange={(e) => this.changeDescEl(e.target.value, 'altIdent', pos)}/>
                  <div className="mdc-textfield__bottom-line" style={{transformOrigin: '145px center'}}/>
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
          <div className="mdc-layout-grid__inner">
            <div className="mdc-layout-grid__cell--span-3">
              <label>Descriptions</label>
              <p className="mdc-textfield-helptext mdc-textfield-helptext--persistent">
                Contains a brief description of the object documented by its parent element, typically a documentation element or an entity.
              </p>
            </div>
            <div className="mdc-layout-grid__cell--span-8">{
              this.state.desc.map((d, pos) => {
                return (<div className="mdc-layout-grid__inner" key={`d${pos}`}>
                  <div className="mdc-layout-grid__cell--span-11">
                    <AceEditor
                      ref={(ae) => { this.aceEditors[pos] = ae }}
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
                    <i className="material-icons romajs-clickable" onClick={() => { this.removeDescEl('desc', pos) }}>clear</i>
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
        </div>
      </div>
    </main>]
  }
}

Element.propTypes = {
  success: PropTypes.bool,
  element: PropTypes.object,
  navigateTo: PropTypes.func,
  updateElementDocs: PropTypes.func
}
