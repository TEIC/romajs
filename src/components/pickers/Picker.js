import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { _i18n } from '../../localization/i18n'

export default class Picker extends Component {
  constructor(props) {
    super(props)
    this.state = {
      filterTerm: ''
    }
  }

  setFilterTerm = (e) => {
    this.setState({filterTerm: e.target.value})
  }

  addItem = (item) => {
    this.props.add(this.props.pickerType, item)
    this.setState({filterTerm: ''})
  }

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
          if ((t === '' && this.props.showAll) || (t !== '' && c.ident.toLowerCase().match(t))) {
            return (<li className="mdc-list-item" key={`c${pos}`}>
              <span className="mdc-list-item__graphic" onClick={() => this.addItem(c)}>
                <i className="material-icons">add_circle_outline</i>
              </span>
              <span className="mdc-list-item__text">
                {c.ident}
                <span className="mdc-list-item__secondary-text">{c.shortDesc}</span>
              </span>
            </li>)
          } else return null
        })
      }</ul>
    </div>)
  }
}

Picker.propTypes = {
  showAll: PropTypes.bool,
  items: PropTypes.array,
  pickerType: PropTypes.string,
  add: PropTypes.func,
  language: PropTypes.string.isRequired
}
