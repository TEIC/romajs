import React, { Component } from 'react'
import PropTypes from 'prop-types'
import * as i18n from '../localization/FilterSearchBar'

export default class FilterSearchBar extends Component {
  render() {
    return (
      <div className="mdc-text-field romajs-searchbar mdc-text-field--with-trailing-icon mdc-ripple-upgraded">
        <input type="text" id="search-text-field" className="mdc-text-field__input"
          placeholder={i18n.filter[this.props.language]}
          onChange={(e)=>{this.props.setFilterTerm(e.target.value)}}/>
        <i className="material-icons mdc-text-field__icon">search</i>
        <div className="mdc-line-ripple"/>
      </div>
    )
  }
}

FilterSearchBar.propTypes = {
  setFilterTerm: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired
}
