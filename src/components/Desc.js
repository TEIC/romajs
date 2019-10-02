import React, { Component } from 'react'
import PropTypes from 'prop-types'
import AceEditor from 'react-ace'
import ReactResizeDetector from 'react-resize-detector'

import 'brace/mode/xml'
import 'brace/theme/tomorrow'

export default class Desc extends Component {
  constructor(props) {
    super(props)
    this.aceEditors = []
    this.descTag = props.valDesc ? 'valDesc' : 'desc'
  }

  componentDidMount() {
    this.setupEditors()
  }

  componentDidUpdate() {
    this.setupEditors()
  }

  setupEditors = () => {
    this.aceEditors.forEach((reactAceComponent, descIndex) => {
      const editor = reactAceComponent.editor
      if (!editor._amSetUp) {
        editor._amSetUp = true
        editor.setOption('wrap', true)

        const updateVersionDate = () => {
          const d = new Date()
          const monthNum = d.getUTCMonth()
          const month = monthNum.toString().length === 2 ? monthNum : '0' + monthNum
          const dayNum = d.getUTCDate()
          const day = dayNum.toString().length === 2 ? dayNum : '0' + dayNum
          const newDate = `versionDate="${d.getUTCFullYear()}-${month}-${day}"`
          const match = /[dD]esc.*?versionDate="[^""]+"/.exec(this.props.desc[descIndex])
          let text = this.props.desc[descIndex]
          if (match) {
            text = text.replace(/[dD]esc(.*?)versionDate="[^""]+"/, `desc$1${newDate}`)
          } else {
            text = text.replace(/[dD]esc\s/, `desc ${newDate} `)
          }
          if (this.props.desc[descIndex] !== text) {
            this.props.update(this.props.ident, text, descIndex, this.props.valItem)
          }
        }
        const getRootElRanges = () => {
          // Determine character range of root opening and closing tag
          const descLines = this.props.desc[descIndex].split(/\r\n|[\n\v\f\r\x85\u2028\u2029]/)

          const openingTagMatch = new RegExp(`<${this.descTag}[^>]*>`).exec(descLines[0])
          const openingTag = {
            row: 0,
            start: openingTagMatch.index,
            end: openingTagMatch.index + openingTagMatch[0].length
          }

          const closingTagMatch = new RegExp(`<\/${this.descTag}\s*>`).exec(descLines[descLines.length - 1])
          const closingTag = {
            row: descLines.length - 1,
            start: closingTagMatch.index,
            end: closingTagMatch.index + closingTagMatch[0].length
          }

          return {openingTag, closingTag}
        }

        let rootElRanges = getRootElRanges()
        let openingTagRange = rootElRanges.openingTag
        let closingTagRange = rootElRanges.closingTag

        // Override selectall to make sure root element tags are not selected
        editor.commands.addCommand({
          name: 'selectall',
          bindKey: {win: 'Ctrl-A', mac: 'Command-A'},
          exec: function(ed) {
            const ranges = getRootElRanges()
            const dummyRange = ed.session.selection.getRange()
            dummyRange.start.row = ranges.openingTag.row
            dummyRange.start.column = ranges.openingTag.end
            dummyRange.end.row = ranges.closingTag.row
            dummyRange.end.column = ranges.closingTag.start
            ed.session.selection.setSelectionRange(dummyRange)
          }
        })

        // Force cursor and anchor to not get into root element tags.
        editor.session.on('change', () => {
          updateVersionDate()
          if (editor.session.getValue() !== '') {
            rootElRanges = getRootElRanges()
            openingTagRange = rootElRanges.openingTag
            closingTagRange = rootElRanges.closingTag
          }
        })

        editor.session.$worker.on('error', (e) => {
          if (e.data.length > 0) {
            editor.container.style.border = '5px solid red'
            this.props.setValid(false)
          } else {
            editor.container.style.border = '1px solid lightgrey'
            this.props.setValid(true)
          }
        })

        const preventHomeEnd = () => {
          const cursor = editor.session.selection.getCursor()
          const lines = editor.session.getLength() - 1
          if (cursor.row === lines && cursor.column === editor.session.getLine(lines).length) {
            editor.session.selection.setSelectionAnchor(closingTagRange.row, closingTagRange.start)
            editor.session.selection.moveCursorTo(closingTagRange.row, closingTagRange.start)
          } else if (cursor.row === 0 && cursor.column === 0) {
            editor.session.selection.setSelectionAnchor(openingTagRange.row, openingTagRange.end)
            editor.session.selection.moveCursorTo(openingTagRange.row, openingTagRange.end)
          }
        }

        editor.session.selection.on('changeSelection', () => {
          preventHomeEnd()
        })

        editor.session.selection.on('changeCursor', () => {
          const cursor = editor.session.selection.getCursor()
          const anchor = editor.session.selection.getSelectionAnchor()
          if (cursor.row === openingTagRange.row) {
            if (cursor.column > openingTagRange.start && cursor.column < openingTagRange.end) {
              editor.session.selection.moveCursorTo(openingTagRange.row, openingTagRange.end)
            }
          }
          if (cursor.row === closingTagRange.row) {
            if (cursor.column > closingTagRange.start) {
              editor.session.selection.moveCursorTo(closingTagRange.row, closingTagRange.start)
            }
          }
          if (anchor.row === openingTagRange.row) {
            if (anchor.column >= openingTagRange.start && anchor.column < openingTagRange.end) {
              editor.session.selection.moveCursorTo(openingTagRange.row, openingTagRange.end)
              editor.session.selection.setSelectionAnchor(openingTagRange.row, openingTagRange.end)
            }
          }
          if (anchor.row === closingTagRange.row) {
            if (anchor.column > closingTagRange.start) {
              editor.session.selection.setSelectionAnchor(closingTagRange.row, closingTagRange.start)
            }
          }
          preventHomeEnd()
        })
        // TODO: this is for tinkering in browser, remove:
        window.editor = editor
      }
    })
  }

  onResize(pos) {
    this.aceEditors[pos].editor.resize()
  }

  render() {
    let info = (<div className="mdc-layout-grid__cell--span-3">
      <label>Description</label>
      <p className="mdc-text-field-helper-text mdc-text-field-helper-text--persistent">
        Contains a brief description of the object documented by its parent element, typically a documentation element or an entity.
      </p>
    </div>)
    if (this.props.valDesc) {
      info = ( <div className="mdc-layout-grid__cell--span-3">
        <label>Value description</label>
        <p className="mdc-text-field-helper-text mdc-text-field-helper-text--persistent">
          Specifies any semantic or syntactic constraint on the value that an attribute may take, additional to the information carried by the datatype element.
        </p>
      </div>)
    }
    let nodesc
    if (this.props.desc.length === 0) {
      nodesc = (<i className="material-icons romajs-clickable" onClick={() => {
        this.props.update(this.props.ident, `<${this.descTag} xmlns="http://www.tei-c.org/ns/1.0" xml:lang="${this.props.docLang}"></${this.descTag}>`, 0, this.props.valItem)
      }}>add_circle_outline</i>)
    }
    return (<div className="mdc-layout-grid__inner romajs-formrow">
      {info}
      {nodesc}
      <div className="mdc-layout-grid__cell--span-8">{
        this.props.desc.map((d, pos) => {
          return (
            <div key={`d${pos}`} className="mdc-layout-grid__cell--span-10" style={{resize: 'both'}}>
              <AceEditor
                style={{resize: 'both'}}
                ref={(ae) => { ae ? this.aceEditors[pos] = ae : null }}
                mode="xml"
                theme="tomorrow"
                name={`ace_desc${pos}`}
                fontSize={14}
                showPrintMargin={false}
                showGutter
                highlightActiveLine
                value={d}
                onChange={(text) => {
                  this.props.update(this.props.ident, text, pos, this.props.valItem)
                }}
                height="100px"
                width="80%"
                editorProps={{
                  $blockScrolling: Infinity
                }}/>
              <ReactResizeDetector handleWidth handleHeight onResize={() => {this.onResize(pos)}} />
            </div>)
        })
      }
      </div>
    </div>)
  }
}

// Omitting desc delete button for now until different languages get implemented.
/*
<div className="mdc-layout-grid__cell--span-1">
  <i className="material-icons romajs-clickable" onClick={() => { this.props.delete(pos) }}>clear</i>
</div>
*/

Desc.propTypes = {
  ident: PropTypes.string.isRequired,
  desc: PropTypes.array.isRequired,
  update: PropTypes.func.isRequired,
  delete: PropTypes.func.isRequired,
  valDesc: PropTypes.bool,
  docLang: PropTypes.string.isRequired,
  valItem: PropTypes.string,
  setValid: PropTypes.func
}
