import React from 'react'
import PropTypes from 'prop-types'
import Picker from './Picker'
import { _i18n } from '../../localization/i18n'

export default class AttPicker extends Picker {
  render() {
    const i18n = _i18n(this.props.language, 'Pickers')
    return (<div className="romajs-editable-list-add romajs-clickable">
      <div className="mdc-text-field mdc-text-field--outlined">
        <input className="mdc-text-field__input" placeholder={i18n('Find...')} type="text"
          value={this.state.filterTerm}
          onChange={this.setFilterTerm}/>
      </div>
      <ul className="mdc-list mdc-list--dense mdc-list--two-line romajs-picker">{
        this.props.items.map((c, pos) => {
          const t = this.state.filterTerm.toLowerCase()
          let local = ''
          let localClass = ''
          if (c.isLocal) {
            local = i18n('(currently not in customization)')
            localClass = 'romajs-localatt'
          }
          if ((t === '' && this.props.showAll) || (t !== '' && c.ident.toLowerCase().match(t))) {
            return (<li className="mdc-list-item" key={`c${pos}`}>
              <span className="mdc-list-item__graphic" tabIndex={0}
                onClick={() => this.addItem(c)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && this.addItem(c)}>
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

AttPicker.propTypes = {
  language: PropTypes.string.isRequired,
  showAll: PropTypes.bool
}
