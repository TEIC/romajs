import React from 'react'
import PropTypes from 'prop-types'
import { Component } from 'react'
import FilterSearch from '../containers/FilterSearch'
import Member from './Member'

export default class MembersList extends Component {
  render() {
    let content = (
      <figure>
        <div role="progressbar" className="mdc-linear-progress mdc-linear-progress--indeterminate">
          <div className="mdc-linear-progress__buffering-dots"/>
          <div className="mdc-linear-progress__buffer"/>
          <div className="mdc-linear-progress__bar mdc-linear-progress__primary-bar">
            <span className="mdc-linear-progress__bar-inner"/>
          </div>
          <div className="mdc-linear-progress__bar mdc-linear-progress__secondary-bar">
            <span className="mdc-linear-progress__bar-inner"/>
          </div>
        </div>
        <figcaption>Loading ODD data...</figcaption>
      </figure>)
    if (this.props.elements.length > 0) {
      content = [<div key="toolbar" className="mdc-toolbar--fixed mdc-toolbar__row romajs-toolbar2">
        <section className="mdc-toolbar__section mdc-toolbar__section--align-start">
          <span className="mdl-chip mdl-chip--deletable romajs-active">
            <span className="mdl-chip__text">Elements</span>
            <button type="button" className="mdl-chip__action"><i className="material-icons">cancel</i></button>
          </span>
        </section>
        <section className="mdc-toolbar__section mdc-toolbar__section--align-end">
          <FilterSearch/>
        </section>
      </div>,
      <main key="main">
        <ul key="list" className="mdc-list mdc-list--two-line romajs-itemlist">
          {this.props.elements.map(element => {
            if (element.visible) {
              return (<Member
                key={element.ident}
                {...element}
                toggleItem={this.props.toggleItem}
              />)
            }
            return ''
          }
          )}
        </ul>
      </main>]
    }
    return content
  }
}

MembersList.propTypes = {
  elements: PropTypes.arrayOf(PropTypes.shape({
    selected: PropTypes.bool.isRequired,
    visible: PropTypes.bool.isRequired,
    ident: PropTypes.string.isRequired,
    shortDesc: PropTypes.string.isRequired,
    desc: PropTypes.array.isRequired,
    module: PropTypes.string.isRequired,
    module_selected: PropTypes.bool.isRequired
  }).isRequired).isRequired,
  toggleItem: PropTypes.func.isRequired
}
