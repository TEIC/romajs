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
      const opts = Array.from(this.getOptions())
      for (const opt of opts) {
        if (opt[0] !== '...') {
          pickerOptions.push({ident: opt[0], shortDesc: opt[1]})
        }
      }
      thisEditor.setState({
        pickerOptions,
        pickerVisible: true,
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
    this.state = {
      initialXml,
      pickerOptions: [],
      pickerVisible: false,
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
      newStmt.setAttribute('depth', c.depth)
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
        // Go back up to necessary depth ancestor::statement/block and create a next element
        // const oldBlock = stmt.parentNode.closest('statement').getElementsByTagName('block')[0]
        const oldStmt = start.querySelectorAll(`statement[depth='${c.depth - 1}']`)
        const oldBlock = oldStmt[oldStmt.length - 1].getElementsByTagName('block')[0]
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
      },
      xmlDidChange: (xml) => {
        const blocklyXml = xmlParser.parseFromString(xml, 'text/xml')
        const contentObject = []
        let valid = true
        function _processXml(block, curContent) {
          const o = {}
          const type = block.getAttribute('type')
          // Do not update state if alternate|sequence is incomplete
          if (type === 'alternate' || type === 'sequence') {
            if (!Array.from(block.children).filter(c => c.tagName === 'statement').length > 0) {
              valid = false
            }
          }
          for (const blockChild of block.children) {
            if (blockChild.tagName === 'field') {
              const bName = blockChild.getAttribute('name')
              // Do not update state if a key is not set.
              if (blockChild.textContent !== '...') {
                o[bName] = blockChild.textContent
              } else valid = false
              // Do no update state if (min|max)Occurs is not valid
              if (bName === 'minOccurs' | bName === 'maxOccurs') {
                if (!blockChild.textContent.match(/\d+|Infinity/)) {
                  valid = false
                }
              }
            } else if (blockChild.tagName === 'next') {
              _processXml(blockChild.querySelector('block'), curContent)
            } else if (blockChild.tagName === 'statement') {
              o.content = []
              _processXml(blockChild.querySelector('block'), o.content)
            }
          }
          if (valid) {
            curContent.unshift(o)
            o.type = block.getAttribute('type')
          }
          return curContent
        }
        _processXml(blocklyXml.querySelector("block[type='content'] block"), contentObject)
        // Now pass this to an action to update content
        if (valid) {
          this.props.updateContentModel(contentObject)
        }
      }
    }
    return (<div>
      <ModalPicker visible={this.state.pickerVisible} items={this.state.pickerOptions} pickerType="blockly"
        cancel={() => {this.setState({pickerVisible: false})}}
        add={ (t, i) => {
          this.setState({pickerVisible: false})
          this.state.pickerAdd(i)
        }} message="Not seeing something you're looking for? <a href='#'>Manage members</a>"/>
      {React.createElement(ReactBlocklyComponent.BlocklyEditor, config)}
    </div>)
  }
}

BlocklyRomaJsEditor.propTypes = {
  flattenedContent: PropTypes.array,
  updateContentModel: PropTypes.func,
  elements: PropTypes.array,
  macros: PropTypes.array,
  classes: PropTypes.array,
  datatypes: PropTypes.array
}
