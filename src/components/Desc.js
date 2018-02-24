import React, { Component } from 'react'
import PropTypes from 'prop-types'
import AceEditor from 'react-ace'

import 'brace/mode/xml'
import 'brace/theme/tomorrow'

export default class Desc extends Component {
  constructor(props) {
    super(props)
    this.aceEditors = []
  }

  componentDidMount() {
    this.setupEditors()
  }

  setupEditors = () => {
    for (const reactAceComponent of this.aceEditors) {
      const editor = reactAceComponent.editor
      editor.setOption('wrap', true)
      // TODO: this is for tinkering in browser, remove:
      // window.editor = editor
    }
  }

  render() {
    return (<div className="mdc-layout-grid__inner romajs-formrow">
      <div className="mdc-layout-grid__cell--span-3">
        <label>Descriptions</label>
        <p className="mdc-text-field-helper-text mdc-text-field-helper-text--persistent">
          Contains a brief description of the object documented by its parent element, typically a documentation element or an entity.
        </p>
      </div>
      <div className="mdc-layout-grid__cell--span-8">{
        this.props.desc.map((d, pos) => {
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
                onChange={(text) => this.props.updateElementDocs(this.props.element, text, pos)}
                height="100px"
                width="80%"
                editorProps={{
                  $blockScrolling: Infinity
                }}/>
            </div>
            <div className="mdc-layout-grid__cell--span-1">
              <i className="material-icons romajs-clickable" onClick={() => { this.props.deleteElementDocs(this.props.element, pos) }}>clear</i>
            </div>
          </div>)
        })
      }
      <div><i className="material-icons romajs-clickable" onClick={() => {
        const pos = this.props.desc.length
        this.props.updateElementDocs(this.props.element, '<desc xmlns="http://www.tei-c.org/ns/1.0" xml:lang="en"></desc>', pos)
      }}>add_circle_outline</i></div>
      </div>
    </div>)
  }
}

Desc.propTypes = {
  element: PropTypes.string,
  desc: PropTypes.array,
  updateElementDocs: PropTypes.func,
  deleteElementDocs: PropTypes.func
}
