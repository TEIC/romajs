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
      desc: props.element.desc[0],
      changed: false,
      isSaveDialogOpen: false
    }
  }

  componentWillMount() {
    if (!this.props.success) {
      this.props.navigateTo('/')
    }
  }

  componentDidMount() {
    const reactAceComponent = this.refs.ace_desc
    const editor = reactAceComponent.editor
    editor.setOption('wrap', true)
    // This is for testing in browser, remove:
    // window.editor = editor
  }

  changeDescEl = (text, el) => {
    if (text !== this.state[el]) {
      this.setState({changed: true})
      const newState = {}
      newState[el] = text
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
      this.props.updateElementDocs(this.props.element.ident, 'altIdent', this.state.altIdent)
      this.props.updateElementDocs(this.props.element.ident, 'desc', [this.state.desc])
      this.setState({changed: false})
    }
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
          <span className="mdl-chip__text">Revert to original</span>
          <button type="button" className="mdl-chip__action">
            <i className="material-icons">undo</i>
          </button>
        </span>
        <span className="mdl-chip mdl-chip--deletable romajs-clickable" onClick={this.save}>
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
              <label htmlFor="fouc">Alternative identifier</label>
            </div>
            <div className="mdc-layout-grid__cell--span-8">
              <div className="mdc-textfield mdc-textfield--upgraded">
                <input id="fouc" type="text" className="mdc-textfield__input" value={this.state.altIdent}
                  onChange={(e) => this.changeDescEl(e.target.value, 'altIdent')}/>
                <div className="mdc-textfield__bottom-line" style={{transformOrigin: '145px center'}}/>
              </div>
              <p className="mdc-textfield-helptext mdc-textfield-helptext--persistent">
                All documentation elements in ODD have a canonical name, supplied as the value for their ident attribute.
                <br/>The altIdent element is used to supply an alternative name for the corresponding XML object, perhaps in a different language.
              </p>
            </div>
          </div>
          <div className="mdc-layout-grid__inner">
            <div className="mdc-layout-grid__cell--span-3">
              <label htmlFor="textarea">Description</label>
            </div>
            <div className="mdc-layout-grid__cell--span-8">
              <AceEditor
                ref="ace_desc"
                mode="xml"
                theme="tomorrow"
                name="ace_desc"
                fontSize={14}
                showPrintMargin={false}
                showGutter={true}
                highlightActiveLine={true}
                value={this.state.desc}
                onChange={(text) => this.changeDescEl(text, 'desc')}
                height="100px"
                width="80%"
                editorProps={{
                  $blockScrolling: Infinity
                }}/>
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
