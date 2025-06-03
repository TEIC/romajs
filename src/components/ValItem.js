import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Desc from '../containers/EditValItemDesc'

export default class ValItem extends Component {
  render() {
    const valItem = this.props.valItem
    const desc = this.props.memberType === 'dt' ? ''
      : (<Desc key="d"
        language={this.props.language}
        member={this.props.member}
        memberType={this.props.memberType}
        attribute={this.props.attribute}
        valItem={valItem.ident} />)
    return [<div className="mdc-layout-grid__inner romajs-formrow" key="row1">
      <div className="mdc-layout-grid__cell--span-2">
        <i className={`material-icons romajs-clickable`} tabIndex={0}
          onClick={() => this.props.deleteValItem(valItem.ident)}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && this.props.deleteValItem(valItem.ident)}
        >clear</i>
        {valItem.ident ? valItem.ident : '(empty string)'}
      </div>
      <div className="mdc-layout-grid__cell--span-10">
        {valItem.shortDesc}
      </div>
    </div>,
    desc]
  }
}

ValItem.propTypes = {
  valItem: PropTypes.object.isRequired,
  member: PropTypes.object.isRequired,
  memberType: PropTypes.string.isRequired,
  attribute: PropTypes.object,
  deleteValItem: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired
}
