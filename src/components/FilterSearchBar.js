import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { i18n as _i18n } from '../localization/FilterSearchBar'

export default class FilterSearchBar extends Component {
  constructor(props) {
    super(props)
    this.state = {fullMatch: false}
  }

  render() {
    // Set language function
    const i18n = _i18n(this.props.language)
    const style = {}
    if (this.state.fullMatch) {
      style.color = '#225688'
    }
    return (
      <div className="mdc-text-field romajs-searchbar mdc-text-field--with-trailing-icon mdc-ripple-upgraded">
        <input type="text" id="search-text-field" className="mdc-text-field__input"
          placeholder={i18n('filter items')}
          onChange={(e)=>{this.props.setFilterTerm(e.target.value)}}/>
        <i title="Match full word" className="mdc-text-field__icon material-icons" style={style} tabIndex="0" onClick={() => {
          this.props.setFilterOptions({fullMatch: !this.state.fullMatch})
          this.setState({fullMatch: !this.state.fullMatch})
        }}>format_shapes</i>
        <div className="mdc-line-ripple"/>
      </div>
    )
  }
}

FilterSearchBar.propTypes = {
  setFilterTerm: PropTypes.func.isRequired,
  setFilterOptions: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired
}
