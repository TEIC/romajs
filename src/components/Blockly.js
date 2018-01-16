import React, { Component } from 'react'
import ReactBlocklyComponent from 'react-blockly-component'
import PropTypes from 'prop-types'
import Blockly from 'node-blockly/browser'
import { content, alternate, sequence, elementRef, classRef, dataRef, macroRef,
  anyElement, empty, textNode } from '../utils/blocks'

const xmlParser = new DOMParser()
const xmlSerializer = new XMLSerializer()

export default class BlocklyRomaJsEditor extends Component {
  constructor(props) {
    super(props)
    // Add custom blocks for ODD content defintions
    Blockly.Blocks.content = content
    Blockly.Blocks.alternate = alternate
    Blockly.Blocks.sequence = sequence
    Blockly.Blocks.elementRef = elementRef
    Blockly.Blocks.classRef = classRef
    Blockly.Blocks.dataRef = dataRef
    Blockly.Blocks.macroRef = macroRef
    Blockly.Blocks.anyElement = anyElement
    Blockly.Blocks.empty = empty
    Blockly.Blocks.textNode = textNode

    this.state = {
      initialXml: ''
    }
    const templateXml = `<xml xmlns="http://www.w3.org/1999/xhtml">
      <block type="content" deletable="false" x="10" y="10">
        <statement name="references" id="start"></statement>
      </block></xml>`
    this.blocklyXml = xmlParser.parseFromString(templateXml, 'text/xml')
    this.processContent(props.elementContent, this.blocklyXml.getElementById('start'))
    const initialXml = xmlSerializer.serializeToString(this.blocklyXml)
    console.log(initialXml)
    this.state = { initialXml }
  }

  createBlock = (c) => {
    const block = this.blocklyXml.createElement('block')
    block.setAttribute('type', c.type)
    // Create fields
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
    window.Blockly = Blockly // TODO: This is bad, find fix.
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
      workspaceDidChange: function(newXml) {
        newXml
        // console.log(newXml)
      }
    }
    return React.createElement(ReactBlocklyComponent.BlocklyEditor, config)
  }
}

BlocklyRomaJsEditor.propTypes = {
  elementContent: PropTypes.array,
}
