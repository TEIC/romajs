import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ModelClassPicker from '../containers/ModelClassPicker'
import { Link } from 'react-router-dom'

export default class ModelClassMemberships extends Component {
  render() {
    return (<div className="mdc-layout-grid">
      <div className="mdc-layout-grid__inner romajs-formrow">
        <div className="mdc-layout-grid__cell--span-3">
          <label>Class Membership</label>
          <p className="mdc-text-field-helper-text mdc-text-field-helper-text--persistent">
            Elements member of this class will also inherit content from the classes listed here. <br/>
            Change class membership here.
          </p>
        </div>
        <div className="mdc-layout-grid__cell--span-8">
          <ModelClassPicker message={
            <span>Not seeing something you're looking for? Add it on the&nbsp;
              <Link to="/members" target="_blank">Members Page</Link> (opens in new tab).</span>
          }/>
          <ul className="mdc-list mdc-list--two-line">{
            this.props.memberships.map((c, pos) => {
              let deleted = ''
              let content = <Link to={`/class/${c.ident}`}>{c.ident}</Link>
              if (c.mode === 'deleted' || c.mode === 'not available') {
                deleted = 'romajs-att-deleted'
                content = `${c.ident} (${c.mode})`
              }
              let button = (<i className={`${deleted} material-icons romajs-clickable`} onClick={() => {
                this.props.removeMembershipToClass(this.props.member.ident, c.ident)
              }}>clear</i>)
              if (c.mode === 'deleted') {
                button = (<i className="material-icons romajs-clickable" onClick={() => {
                  this.props.addMembershipToClass(this.props.member.ident, c.ident)
                }}>add_circle_outline</i>)
              } else if (c.mode === 'not available') {
                button = ''
              }
              return (<li key={`c${pos}`} className="mdc-list-item">
                <span className="mdc-list-item__graphic">{button}</span>
                <span className={`mdc-list-item__text ${deleted}`}>
                  {content}
                  <span className="mdc-list-item__secondary-text">
                    {c.shortDesc}
                  </span>
                </span>
              </li>)
            })
          }</ul>
        </div>
      </div>
      <div className="mdc-layout-grid__inner romajs-formrow">
        <div className="mdc-layout-grid__cell--span-3">
          <label>Member Classes</label>
          <p className="mdc-text-field-helper-text mdc-text-field-helper-text--persistent">
            The classes listed here inherit content from this class.
          </p>
        </div>
        <div className="mdc-layout-grid__cell--span-8">
          <ul className="mdc-list mdc-list--two-line">{
            this.props.memberClasses.map((c, pos) => {
              let deleted = ''
              let content = <Link to={`/class/${c.ident}`}>{c.ident}</Link>
              if (c.mode === 'deleted') {
                deleted = 'romajs-att-deleted'
                content = `${c.ident} (not available)`
              }
              return (<li key={`c${pos}`} className={`mdc-list-item ${deleted}`}>
                <span className="mdc-list-item__text">
                  {content}
                  <span className="mdc-list-item__secondary-text">
                    {c.shortDesc}
                  </span>
                </span>
              </li>)
            })
          }</ul>
        </div>
      </div>
    </div>)
  }
}

ModelClassMemberships.propTypes = {
  member: PropTypes.object.isRequired,
  memberType: PropTypes.string.isRequired,
  memberships: PropTypes.array.isRequired,
  memberClasses: PropTypes.array.isRequired,
  path: PropTypes.string.isRequired,
  navigateTo: PropTypes.func.isRequired,
  removeMembershipToClass: PropTypes.func.isRequired,
  addMembershipToClass: PropTypes.func.isRequired,
  clearPicker: PropTypes.func.isRequired
}
