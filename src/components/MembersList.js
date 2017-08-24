import React from 'react'
import PropTypes from 'prop-types'
import { Component } from 'react'
import Member from './Member'

export default class MembersList extends Component {
  render() {
    return (<ul className="mdc-list mdc-list--two-line romajs-itemlist">
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
}

MembersList.propTypes = {
  elements: PropTypes.arrayOf(PropTypes.shape({
    selected: PropTypes.bool.isRequired,
    visible: PropTypes.bool.isRequired,
    ident: PropTypes.string.isRequired,
    desc: PropTypes.string.isRequired,
    module: PropTypes.string.isRequired
  }).isRequired).isRequired,
  toggleItem: PropTypes.func.isRequired
}
