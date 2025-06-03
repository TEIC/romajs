import React, { Component } from 'react'
import PropTypes from 'prop-types'
import NewAttributeDialog from '../containers/NewAttributeDialog'

export default class AttributesOnMember extends Component {
  constructor(props) {
    super(props)
    this.state = {
      show: false
    }
  }

  render() {
    return ([
      <i key="i" className="material-icons romajs-clickable" tabIndex={0}
        onClick={() => {this.setState({show: true})}}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && this.setState({show: true})}>add_circle_outline</i>,
      <NewAttributeDialog key="nad" show={this.state.show} add={this.props.addMemberAttribute} member={this.props.member}
        hide={() => {this.setState({show: false})}} />,
      <ul className="mdc-list" key="elatts">{
        this.props.member.attributes.map((a, pos) => {
          if (a.mode === 'add' || (a.mode === 'delete' && a.onElement) || (a.mode === 'delete' && a.onClass) || (a.mode === 'change' && a._changedOnMember)) {
            const deleted = a.deleted ? 'romajs-att-deleted' : ''
            let addOrRemove
            if (a.deleted) {
              addOrRemove = (<i className={`material-icons romajs-clickable`} tabIndex={0}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && this.props.restoreMemberAttribute(this.props.member.ident, a.ident)}
                onClick={() => this.props.restoreMemberAttribute(this.props.member.ident, a.ident)}>add_circle_outline</i>)
            } else {
              addOrRemove = (<i className={`material-icons romajs-clickable ${deleted}`} tabIndex={0}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && this.props.deleteMemberAttribute(this.props.member.ident, a.ident)}
                onClick={() => this.props.deleteMemberAttribute(this.props.member.ident, a.ident)}>clear</i>)
            }
            const noeffect = a.noeffect ? 'romajs-att-noeffect' : ''
            let noeffectText = ''
            if (a.noeffect) {
              noeffectText = '(this change won\'t have any effect, check ODD source)'
            }
            return (<li key={`c${pos}`} className={`mdc-list-item ${noeffect}`}>
              <span className="mdc-list-item__graphic">
                <i className={`material-icons romajs-clickable ${deleted}`} tabIndex={0}
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && this.props.editAttribute(this.props.member.ident, a.ident, this.props.path)}
                  onClick={() => this.props.editAttribute(this.props.member.ident, a.ident, this.props.path)}>
                  mode_edit</i>
                {addOrRemove}
              </span>
              <span className="mdc-list-item__text">
                {a.ident} {noeffectText}
                <span className="mdc-list-item__secondary-text">
                  {a.shortDesc}
                </span>
              </span>
            </li>)
          } else return null
        })
      }</ul>
    ])
  }
}

AttributesOnMember.propTypes = {
  path: PropTypes.string.isRequired,
  member: PropTypes.object.isRequired,
  memberType: PropTypes.string.isRequired,
  editAttribute: PropTypes.func.isRequired,
  deleteMemberAttribute: PropTypes.func.isRequired,
  restoreMemberAttribute: PropTypes.func.isRequired,
  addMemberAttribute: PropTypes.func.isRequired
}
