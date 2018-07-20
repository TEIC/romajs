import React from 'react'
import Picker from './Picker'

export default class AttPicker extends Picker {
  render() {
    return (<div className="romajs-editable-list-add romajs-clickable">
      <div className="mdc-text-field mdc-text-field--outlined">
        <input className="mdc-text-field__input" placeholder="Find..." type="text"
          value={this.state.filterTerm}
          onChange={this.setFilterTerm}/>
      </div>
      <ul className="mdc-list mdc-list--dense mdc-list--two-line romajs-picker">{
        this.props.items.map((c, pos) => {
          const t = this.state.filterTerm.toLowerCase()
          let local = ''
          let localClass = ''
          if (c.isLocal) {
            local = '(currently not in customization)'
            localClass = 'romajs-localatt'
          }
          if ((t === '' && this.props.showAll) || (t !== '' && c.ident.toLowerCase().match(t))) {
            return (<li className="mdc-list-item" key={`c${pos}`}>
              <span className="mdc-list-item__graphic" onClick={() => this.addItem(c)}>
                <i className="material-icons">add_circle_outline</i>
              </span>
              <span className={`dc-list-item__text ${localClass}`}>
                {c.ident} {local}
                <span className="mdc-list-item__secondary-text">{c.shortDesc}</span>
              </span>
            </li>)
          } else return null
        })
      }</ul>
    </div>)
  }
}
