import React, { Component } from 'react'
import PropTypes from 'prop-types'
import AceEditor from 'react-ace'
import ReactResizeDetector from 'react-resize-detector'
import { _i18n } from '../localization/i18n'

import 'brace/mode/xml'
import 'brace/theme/tomorrow'

export default class Rng extends Component {
  constructor(props) {
    super(props)
  }

  onResize() {
    this.ace.editor.resize()
  }

  render() {
    const i18n = _i18n(this.props.language, 'Rng')
    return (
      <div className="mdc-layout-grid__cell--span-8">{
        <div className="mdc-layout-grid__cell--span-10" style={{resize: 'both'}}>
          <p className="mdc-typography--body1" style={{fontWeight: 'bold'}}>
            {i18n('RelaxNG elements cannot be edited in Roma.')}
          </p>
          <AceEditor
            style={{resize: 'both'}}
            ref={(ae) => { ae ? this.ace = ae : null }}
            mode="xml"
            theme="tomorrow"
            name={`ace_rng`}
            fontSize={14}
            showPrintMargin={false}
            showGutter
            value={this.props.rngContent}
            height="100px"
            width="80%"
            readOnly
            editorProps={{
              $blockScrolling: Infinity
            }}/>
          <ReactResizeDetector handleWidth handleHeight onResize={() => {this.onResize()}} />
        </div>
      }
      </div>
    )
  }
}

// Omitting desc delete button for now until different languages get implemented.
/*
<div className="mdc-layout-grid__cell--span-1">
  <i className="material-icons romajs-clickable" onClick={() => { this.props.delete(pos) }}>clear</i>
</div>
*/

Rng.propTypes = {
  rngContent: PropTypes.string.isRequired,
  language: PropTypes.string.isRequired
}
