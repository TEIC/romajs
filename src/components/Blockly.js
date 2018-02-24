import React, { Component } from 'react'
import ReactBlocklyComponent from 'react-blockly-component'
import PropTypes from 'prop-types'
import Blockly from 'node-blockly/browser'
import { content, alternate, sequence, elementRef, classRef, dataRef, macroRef,
  anyElement, empty, textNode } from '../utils/blocks'
import ModalPicker from './pickers/ModalPicker'

const xmlParser = new DOMParser()
const xmlSerializer = new XMLSerializer()

export default class BlocklyRomaJsEditor extends Component {
  constructor(props) {
    super(props)

    window.Blockly = Blockly // TODO: This is bad, find fix.

    const thisEditor = this
    Blockly.FieldDropdown.prototype.showEditor_ = function() {
      const pickerOptions = []
      for (const opt of this.getOptions()) {
        pickerOptions.push({ident: opt[0], shortDesc: opt[1]})
      }
      thisEditor.setState({
        pickerOptions,
        pickerAdd: (i) => { this.setValue(i.ident) }
      })
    }

    // Add custom blocks for ODD content defintions
    Blockly.Blocks.content = content
    Blockly.Blocks.alternate = alternate
    Blockly.Blocks.sequence = sequence
    Blockly.Blocks.elementRef = elementRef(props.elements)
    Blockly.Blocks.classRef = classRef(props.classes)
    Blockly.Blocks.dataRef = dataRef(props.datatypes)
    Blockly.Blocks.macroRef = macroRef(props.macros)
    Blockly.Blocks.anyElement = anyElement
    Blockly.Blocks.empty = empty
    Blockly.Blocks.textNode = textNode

    const templateXml = `<xml xmlns="http://www.w3.org/1999/xhtml">
      <block type="content" deletable="false" x="10" y="10">
        <statement name="references" id="start"></statement>
      </block></xml>`
    this.blocklyXml = xmlParser.parseFromString(templateXml, 'text/xml')
    this.processContent(props.flattenedContent, this.blocklyXml.getElementById('start'))
    const initialXml = xmlSerializer.serializeToString(this.blocklyXml)
    // initialXml = `<xml xmlns="http://www.w3.org/1999/xhtml">
    //   <block type="content" deletable="false" x="10" y="10">
    //     <statement name="references" id="start"><block xmlns="" type="sequence"><field name="maxOccurs">1</field><field name="minOccurs">1</field>
    //     <statement name="references"><block type="elementRef"><field name="key">msIdentifier</field><next><block type="classRef">
    //       <field name="key">model.headLike</field><next><block type="alternate"><field name="maxOccurs">1</field><field name="minOccurs">1</field>
    //       <statement name="references"><block type="classRef"><field name="key">model.pLike</field><next><block type="sequence">
    //         <field name="maxOccurs">1</field><field name="minOccurs">1</field><statement name="references"><block type="elementRef">
    //           <field name="key">msContents</field><next><block type="elementRef"><field name="key">physDesc</field><next>
    //             <block type="elementRef"><field name="key">history</field><next><block type="elementRef"><field name="key">additional</field><next>
    //               <block type="alternate"><field name="maxOccurs">1</field><field name="minOccurs">1</field>
    //               <statement name="references"><block type="elementRef"><field name="key">msPart</field><next><block type="elementRef">
    //                 <field name="key">msFrag</field></block></next></block></statement></block></next></block></next></block></next></block></next></block>
    //
    //                 </statement></block></next></block></statement></block></next></block></next></block></statement></block></statement>
    //   </block></xml>`
    this.state = {
      initialXml,
      pickerOptions: [],
      pickerAdd: null
    }
  }

  createBlock = (c) => {
    const block = this.blocklyXml.createElement('block')
    block.setAttribute('type', c.type)
    // Create fields
    if (c.key) {
      const key = this.blocklyXml.createElement('field')
      key.setAttribute('name', 'key')
      key.appendChild(this.blocklyXml.createTextNode(c.key))
      block.appendChild(key)
    }
    if (c.maxOccurs) {
      const maxOccurs = this.blocklyXml.createElement('field')
      maxOccurs.setAttribute('name', 'maxOccurs')
      const text = c.maxOccurs === 'unbounded' ? 'Infinity' : c.maxOccurs
      maxOccurs.appendChild(this.blocklyXml.createTextNode(text))
      block.appendChild(maxOccurs)
    }
    if (c.minOccurs) {
      const minOccurs = this.blocklyXml.createElement('field')
      minOccurs.setAttribute('name', 'minOccurs')
      minOccurs.appendChild(this.blocklyXml.createTextNode(c.minOccurs))
      block.appendChild(minOccurs)
    }
    if (c.require) {
      const requireField = this.blocklyXml.createElement('field')
      requireField.setAttribute('name', 'require')
      requireField.appendChild(this.blocklyXml.createTextNode(c.require))
      block.appendChild(requireField)
    }
    if (c.except) {
      const except = this.blocklyXml.createElement('field')
      except.setAttribute('name', 'except')
      except.appendChild(this.blocklyXml.createTextNode(c.except))
      block.appendChild(except)
    }

    return block
  }

  createStmt = (c, block) => {
    let newStmt = null
    if (c.content) {
      newStmt = this.blocklyXml.createElement('statement')
      newStmt.setAttribute('name', 'references')
      block.appendChild(newStmt)
    }
    return newStmt
  }

  processContent = (cnt, start) => {
    let depth = 0
    let stmt = start
    let curBlock = null
    for (const c of cnt) {
      if (c.depth > depth) {
        // Needs nesting: add to current block's statement
        const block = this.createBlock(c)
        const newStmt = this.createStmt(c, block)
        stmt.appendChild(block)
        // Update globals
        stmt = newStmt ? newStmt : stmt
        curBlock = block
        depth = c.depth
      } else if (c.depth === depth) {
        // Create a next element within the current block
        const block = this.createBlock(c)
        const newStmt = this.createStmt(c, block)
        // Create element next
        const next = this.blocklyXml.createElement('next')
        next.appendChild(block)
        // Append to current blocks
        curBlock.appendChild(next)
        // Update globals
        stmt = newStmt ? newStmt : stmt
        curBlock = block
        depth = c.depth
      } else if (c.depth < depth) {
        // Go back up to ancestor::statement/block and create a next element
        const oldBlock = stmt.parentNode.closest('statement').getElementsByTagName('block')[0]
        const block = this.createBlock(c)
        const newStmt = this.createStmt(c, block)
        // Create element next
        const next = this.blocklyXml.createElement('next')
        next.appendChild(block)
        // Append to old block
        oldBlock.appendChild(next)
        // Update globals
        stmt = newStmt ? newStmt : stmt
        curBlock = block
        depth = c.depth
      }
    }
  }

  render() {
    const config = {
      toolboxCategories: [{
        type: 'groups',
        name: 'Groups',
        colour: '#6da55b',
        blocks: [
          { type: 'alternate' },
          { type: 'sequence' },
        ]
      }, {
        type: 'references',
        name: 'References',
        colour: '#6d5ba5',
        blocks: [
          { type: 'elementRef' },
          { type: 'classRef' },
          { type: 'macroRef' },
          { type: 'dataRef' }
        ]
      }, {
        type: 'nodes',
        name: 'Nodes',
        colour: '#a55b5b',
        blocks: [
          { type: 'anyElement' },
          { type: 'empty' },
          { type: 'textNode' }
        ]
      }],
      initialXml: this.state.initialXml,
      wrapperDivClassName: 'romajs-blockly',
      workspaceDidChange: function(workspace) {
        workspace
        // console.log(workspace)
      },
      xmlDidChange: function(xml) {
        xml
        // console.log(xml)
      }
    }
    let picker = null
    if (this.state.pickerOptions.length > 0) {
      picker = <ModalPicker items={this.state.pickerOptions} pickerType="blockly" add={(t, i) => {this.state.pickerAdd(i)}}/>
    }
    return (<div>
      {picker}
      {React.createElement(ReactBlocklyComponent.BlocklyEditor, config)}
    </div>)
  }
}

BlocklyRomaJsEditor.propTypes = {
  flattenedContent: PropTypes.array,
  elements: PropTypes.array,
  macros: PropTypes.array,
  classes: PropTypes.array,
  datatypes: PropTypes.array
}
