import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
// import {MDCTextfield} from '@material/textfield'
import AceEditor from 'react-ace'

import 'brace/mode/xml'
import 'brace/theme/tomorrow'

export default class Element extends Component {
  constructor(props) {
    super(props)
    this.state = {altIdent: props.element.altIdent}
    this.changeIdent = this.changeIdent.bind(this)
  }

  componentWillMount() {
    if (!this.props.success) {
      this.props.redirect()
    }
  }

  componentDidMount() {
    // const textfield = new MDCTextfield(this.refs.textfield)
    // textfield
    const reactAceComponent = this.refs.ace_desc
    const editor = reactAceComponent.editor
    editor.setOption('wrap', true)
    // editor.$blockScrolling = Infinity
    // editor.moveCursorTo(1, 1)
    window.editor = editor
  }

  changeIdent(event) {
    this.setState({altIdent: event.target.value})
  }

  render() {
    if (!this.props.success) {
      return null
    }
    return (<div className="romajs-form">
      <h1 className="mdc-typography--headline">&lt;{this.props.element.ident}&gt;</h1>

      <div className="mdc-layout-grid">
        <div className="mdc-layout-grid__inner">
          <div className="mdc-layout-grid__cell--span-3">
            <label htmlFor="fouc">Alternative identifier</label>
          </div>
          <div className="mdc-layout-grid__cell--span-8">
            <div className="mdc-textfield mdc-textfield--upgraded">
              <input id="fouc" type="text" className="mdc-textfield__input" value={this.state.altIdent} onChange={this.changeIdent}/>
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
              value={this.props.element.desc[0]}
              editorProps={{
                $blockScrolling: Infinity
              }}/>
          </div>
        </div>
      </div>
      <div><Link to="/members">Back</Link></div>
    </div>)
  }
}

Element.propTypes = {
  success: PropTypes.bool,
  element: PropTypes.object,
  redirect: PropTypes.func
}
