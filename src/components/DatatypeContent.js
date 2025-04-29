import React, { Component } from 'react'
import PropTypes from 'prop-types'
import DataRef from './DataRef'
import ValList from './ValList'
import { _i18n } from '../localization/i18n'
import Rng from './Rng'

export default class DatatypeContent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      addOptionsVisible: false
    }
  }

  toggleAddOptions() {
    if (this.state.addOptionsVisible) {
      this.setState({addOptionsVisible: false})
    } else {
      this.setState({addOptionsVisible: true})
    }
  }

  setDataRefRestriction(value, keyOrName, index) {
    this.props.setDataRefRestriction(
      this.props.datatype.ident,
      keyOrName, value, index)
  }

  render() {
    const i18n = _i18n(this.props.language, 'DatatypeContent')
    let content = this.props.datatype.content || []
    let contentType = null
    let grouping = null
    if (content[0]) {
      if (content[0].type === 'rng') {
        return (<div className="mdc-layout-grid__inner romajs-formrow">
          <div className="mdc-layout-grid__cell--span-3"/>
          <div className="mdc-layout-grid__cell--span-8">
            <Rng language={this.props.language} rngContent={content[0].rngContent}/>
          </div>
        </div>)
      }
      contentType = content[0].type !== 'sequence' && content[0].type !== 'alternate' ? null : content[0].type
      // Go down to sequence or alternate if needed.
      // We assume there is only one level, though more are possible.
      // If we ever find the need for nested contents, this should be switched to a
      // blockly interface.
      if (content[0].type === 'sequence' || content[0].type === 'alternate') {
        content = content[0].content
      }
      grouping = (
        <div className="mdc-layout-grid__inner romajs-formrow">
          <div className="mdc-layout-grid__cell--span-3">
            <label>{i18n('Content Grouping Type')}</label>
            <p className="mdc-text-field-helper-text mdc-text-field-helper-text--persistent"
              dangerouslySetInnerHTML={{__html: i18n('HelperText')}} />
          </div>
          <div className="mdc-layout-grid__cell--span-8 mdc-chip-set mdc-chip-set--choice">
            <div className={`mdc-chip ${!contentType ? 'mdc-chip--selected' : ''}`} tabIndex="0" onClick={() => {
              this.props.setDatatypeContentGrouping(this.props.datatype.ident, 'unordered')
            }}>
              <div className="mdc-chip__text">{i18n('Unordered')}</div>
            </div>
            <div className={`mdc-chip ${contentType === 'alternate' ? 'mdc-chip--selected' : ''}`} tabIndex="1" onClick={() => {
              this.props.setDatatypeContentGrouping(this.props.datatype.ident, 'alternate')
            }}>
              <div className="mdc-chip__text">{i18n('Alternate')}</div>
            </div>
            <div className={`mdc-chip ${contentType === 'sequence' ? 'mdc-chip--selected' : ''}`} tabIndex="2" onClick={() => {
              this.props.setDatatypeContentGrouping(this.props.datatype.ident, 'sequence')
            }}>
              <div className="mdc-chip__text">{i18n('Sequence')}</div>
            </div>
          </div>
        </div>)
    }
    let addOptions = null
    if (this.state.addOptionsVisible) {
      addOptions = [
        <div className="mdc-chip" tabIndex="0" key="r">
          <div className="mdc-chip__text" onClick={() =>{
            this.props.newDataRef(this.props.datatype.ident)
            this.toggleAddOptions()
          }}>{i18n('Reference to another datatype')}</div>
        </div>,
        <div className="mdc-chip" tabIndex="1" key="l">
          <div className="mdc-chip__text" onClick={() =>{
            this.props.newDatatypeValList(this.props.datatype.ident)
            this.toggleAddOptions()
          }}>{i18n('Closed list of values')}</div>
        </div>,
        <div className="mdc-chip" tabIndex="2" key="t">
          <div className="mdc-chip__text" onClick={() =>{
            this.props.newTextNode(this.props.datatype.ident)
            this.toggleAddOptions()
          }}>{i18n('Text content')}</div>
        </div>
      ]
    }
    return (<div className="mdc-layout-grid">
      <div className="mdc-layout-grid__inner romajs-formrow">
        <div className="mdc-layout-grid__cell--span-3">
          <label>{i18n('Datatype Content')}</label>
          <p className="mdc-text-field-helper-text mdc-text-field-helper-text--persistent"
            dangerouslySetInnerHTML={{__html: i18n('HelperTextDt')}} />
        </div>
        <div className="mdc-layout-grid__cell--span-8">
          <div className="mdc-chip-set">
            <span className="romajs-clickable material-icons" onClick={() => this.toggleAddOptions()}>
              add_circle_outline
            </span>
            {addOptions}
          </div>
        </div>
      </div>
      {grouping}
      {content.map((c, i) => {
        switch (c.type) {
          case 'dataRef':
            return (<div className="mdc-layout-grid__inner romajs-formrow" key={`dr${i}`}>
              <div className="mdc-layout-grid__cell--span-3"/>
              <div className="mdc-layout-grid__cell--span-8">
                <span style={{lineHeight: '3em'}}>
                  <i className="material-icons romajs-clickable" onClick={() => {
                    this.props.deleteDatatypeContent(this.props.datatype.ident, i)
                  }}>clear</i>
                  <i className="material-icons romajs-clickable" onClick={() => {
                    this.props.moveDatatypeContent(this.props.datatype.ident, i, i - 1)
                  }}>keyboard_arrow_up</i>
                  <i className="material-icons romajs-clickable" onClick={() => {
                    this.props.moveDatatypeContent(this.props.datatype.ident, i, i + 1)
                  }}>keyboard_arrow_down</i>
                </span>
                <DataRef member={this.props.datatype}
                  language={this.props.language}
                  memberType="datatype"
                  datatype={c.key || c.name}
                  available="true"
                  restriction={c.restriction || ''}
                  index={i}
                  setRestriction={(v) => this.setDataRefRestriction(v, c.key || c.name, i)} />
              </div>
            </div>)
          case 'textNode':
            return (<div className="mdc-layout-grid__inner romajs-formrow" key={`dr${i}`}>
              <div className="mdc-layout-grid__cell--span-3"/>
              <div className="mdc-layout-grid__cell--span-8">
                <span style={{lineHeight: '3em'}}>
                  <i className="material-icons romajs-clickable" onClick={() => {
                    this.props.deleteDatatypeContent(this.props.datatype.ident, i)
                  }}>clear</i>
                  <i className="material-icons romajs-clickable" onClick={() => {
                    this.props.moveDatatypeContent(this.props.datatype.ident, i, i - 1)
                  }}>keyboard_arrow_up</i>
                  <i className="material-icons romajs-clickable" onClick={() => {
                    this.props.moveDatatypeContent(this.props.datatype.ident, i, i + 1)
                  }}>keyboard_arrow_down</i>
                </span>
                Text content
              </div>
            </div>)
          case 'valList':
            return (<div className="mdc-layout-grid__inner romajs-formrow" key={`dr${i}`}>
              <div className="mdc-layout-grid__cell--span-3"/>
              <div className="mdc-layout-grid__cell--span-8">
                <span style={{lineHeight: '3em'}}>
                  <i className="material-icons romajs-clickable" onClick={() => {
                    this.props.deleteDatatypeContent(this.props.datatype.ident, i)
                  }}>clear</i>
                  <i className="material-icons romajs-clickable" onClick={() => {
                    this.props.moveDatatypeContent(this.props.datatype.ident, i, i - 1)
                  }}>keyboard_arrow_up</i>
                  <i className="material-icons romajs-clickable" onClick={() => {
                    this.props.moveDatatypeContent(this.props.datatype.ident, i, i + 1)
                  }}>keyboard_arrow_down</i>
                </span>
                <div>Closed list of values</div>
                <ValList key={`vl${i}`}
                  language={this.props.language}
                  valList={c}
                  memberType="dt"
                  addValItem={(val) => this.props.addDatatypeValItem(this.props.datatype.ident, i, val)}
                  deleteValItem={(val) => this.props.deleteDatatypeValItem(this.props.datatype.ident, i, val)} />
              </div>
            </div>)
          default:
            return ''
        }
      })}
    </div>)
  }
}

DatatypeContent.propTypes = {
  datatype: PropTypes.object,
  setDataRefRestriction: PropTypes.func.isRequired,
  newDataRef: PropTypes.func.isRequired,
  newTextNode: PropTypes.func.isRequired,
  deleteDatatypeContent: PropTypes.func.isRequired,
  moveDatatypeContent: PropTypes.func.isRequired,
  newDatatypeValList: PropTypes.func.isRequired,
  addDatatypeValItem: PropTypes.func.isRequired,
  deleteDatatypeValItem: PropTypes.func.isRequired,
  setDatatypeContentGrouping: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired,
}
