import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Desc from '../containers/EditValItemDesc'

export default class ValItem extends Component {
  render() {
    const valItem = this.props.valItem
    return [<div className="mdc-layout-grid__inner romajs-formrow" key="row1">
      <div className="mdc-layout-grid__cell--span-2">
        <i className={`material-icons romajs-clickable`} onClick={() =>
          this.props.deleteValItem(valItem.ident)}>clear</i>
        {valItem.ident ? valItem.ident : '(empty string)'}
      </div>
      <div className="mdc-layout-grid__cell--span-10">
        {valItem.shortDesc}
      </div>
    </div>,
    <Desc key="d"
      member={this.props.member}
      memberType={this.props.memberType}
      attribute={this.props.attribute}
      valItem={valItem.ident} />]
  }
}

ValItem.propTypes = {
  valItem: PropTypes.object.isRequired,
  member: PropTypes.object.isRequired,
  memberType: PropTypes.string.isRequired,
  attribute: PropTypes.object.isRequired,
  deleteValItem: PropTypes.func.isRequired
}
