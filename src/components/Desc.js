import React, { Component } from 'react'
import PropTypes from 'prop-types'
import AceEditor from 'react-ace'

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

  setupEditors = () => {
    this.aceEditors.forEach((reactAceComponent, descIndex) => {
      const editor = reactAceComponent.editor
      editor.setOption('wrap', true)

      // const updateVersionDate = () => {
      // // TODO: revisit this after deciding how to export to ODD
      // // Problem: if I make a change and undo, the new date will remain, but the ODD
      // // shouldn't update because the content is the same.
      //   const match = /desc.*?versionDate="[^""]+"/.exec(this.props.desc[descIndex])
      //   if (match) {
      //     const d = new Date()
      //     const monthNum = d.getUTCMonth()
      //     const month = monthNum.toString().length === 2 ? monthNum : '0' + monthNum
      //     const dayNum = d.getUTCDate()
      //     const day = dayNum.toString().length === 2 ? dayNum : '0' + dayNum
      //     const newDate = `versionDate="${d.getUTCFullYear()}-${month}-${day}"`
      //     const text = this.props.desc[descIndex].replace(/desc(.*?)versionDate="[^""]+"/, `desc$1${newDate}`)
      //     this.props.updateElementDocs(this.props.ident, text, descIndex)
      //   }
      // }
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
        // updateVersionDate()
        rootElRanges = getRootElRanges()
        openingTagRange = rootElRanges.openingTag
        closingTagRange = rootElRanges.closingTag
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
          if (anchor.column > openingTagRange.start && anchor.column < openingTagRange.end) {
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
      // window.editor = editor
    })
  }

  render() {
    let info = (<div className="mdc-layout-grid__cell--span-3">
      <label>Descriptions</label>
      <p className="mdc-text-field-helper-text mdc-text-field-helper-text--persistent">
        Contains a brief description of the object documented by its parent element, typically a documentation element or an entity.
      </p>
    </div>)
    if (this.props.valDesc) {
      info = ( <div className="mdc-layout-grid__cell--span-3">
        <label>Value descriptions</label>
        <p className="mdc-text-field-helper-text mdc-text-field-helper-text--persistent">
          Specifies any semantic or syntactic constraint on the value that an attribute may take, additional to the information carried by the datatype element.
        </p>
      </div>)
    }
    let nodesc
    if (this.props.desc.length === 0) {
      nodesc = (<i className="material-icons romajs-clickable" onClick={() => {
        this.props.update(this.props.ident, `<${this.descTag} xmlns="http://tei-c.org/ns/1.0" xml:lang="en"></${this.descTag}>`, 0)
      }}>add_circle_outline</i>)
    }
    return (<div className="mdc-layout-grid__inner romajs-formrow">
      {info}
      {nodesc}
      <div className="mdc-layout-grid__cell--span-8">{
        this.props.desc.map((d, pos) => {
          return (<div className="mdc-layout-grid__inner" key={`d${pos}`}>
            <h4 className="mdc-layout-grid__cell--span-1">English</h4>
            <div className="mdc-layout-grid__cell--span-10">
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
                onChange={(text) => this.props.update(this.props.ident, text, pos)}
                height="100px"
                width="80%"
                editorProps={{
                  $blockScrolling: Infinity
                }}/>
            </div>
            <div className="mdc-layout-grid__cell--span-1">
              <i className="material-icons romajs-clickable" onClick={() => { this.props.delete(pos) }}>clear</i>
            </div>
          </div>)
        })
      }
      </div>
    </div>)
  }
}

Desc.propTypes = {
  ident: PropTypes.string.isRequired,
  desc: PropTypes.array.isRequired,
  update: PropTypes.func.isRequired,
  delete: PropTypes.func.isRequired,
  valDesc: PropTypes.bool,
  lang: PropTypes.string
}
