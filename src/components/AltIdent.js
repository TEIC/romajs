import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class AltIdent extends Component {
  render() {
    const addBtn = this.props.altIdent.length > 0 ? null : (<i className="material-icons romajs-clickable" onClick={() => {
      const pos = this.props.altIdent.length
      this.props.update(this.props.ident, '', pos)
    }}>add_circle_outline</i>)
    return (<div className="mdc-layout-grid__inner romajs-formrow">
      <div className="mdc-layout-grid__cell--span-3">
        <label>Alternative identifiers</label>
        <p className="mdc-text-field-helper-text mdc-text-field-helper-text--persistent">
          All documentation elements in ODD have a canonical name, supplied as the value for their ident attribute.
          <br/>The altIdent element is used to supply an alternative name for the corresponding XML object, perhaps in a different language.
        </p>
      </div>
      <div className="mdc-layout-grid__cell--span-8">{
        this.props.altIdent.map((ai, pos) => {
          if (!ai.deleted) {
            return (<div key={`ai${pos}`}><div className="mdc-text-field mdc-text-field--upgraded">
              <input autoFocus type="text" className="mdc-text-field__input" value={ai}
                onChange={(e) => this.props.update(this.props.ident, e.target.value, pos)}/>
              <div className="mdc-text-field__bottom-line" style={{transformOrigin: '145px center'}}/>
            </div>
            <i className="material-icons romajs-clickable" onClick={() => { this.props.delete(this.props.ident, pos) }}>clear</i>
            </div>)
          }
          return null
        })
      }
      {addBtn}
      </div>
    </div>)
  }
}

AltIdent.propTypes = {
  ident: PropTypes.string.isRequired,
  altIdent: PropTypes.array.isRequired,
  update: PropTypes.func.isRequired,
  delete: PropTypes.func.isRequired
}
