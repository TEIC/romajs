import React from 'react'
import PropTypes from 'prop-types'
import { Component } from 'react'
import Member from './Member'

export default class MembersList extends Component {
  render() {
    // let content = (<span className="romajs-loader"><img src={loading}/> Loading ODD data...</span>)
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
      content = (<ul key="list" className="mdc-list mdc-list--two-line romajs-itemlist">
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
      </ul>)
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
