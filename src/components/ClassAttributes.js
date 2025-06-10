import React, { Component } from 'react'
import PropTypes from 'prop-types'
import AttClassAttPicker from '../containers/AttClassAttPicker'
import EditAttribute from '../containers/EditAttribute'
import AttributesOnMember from './AttributesOnMember'
import { Link } from 'react-router-dom'
import { _i18n } from '../localization/i18n'

export default class ClassAttributes extends Component {
  constructor(props) {
    super(props)
    this.state = {
      show: false
    }
  }

  render() {
    const i18n = _i18n(this.props.language, 'ClassAttributes')
    const i18nNotSeeing = _i18n(this.props.language, 'NotSeeingMessage')
    if (this.props.attribute) {
      return <EditAttribute member={this.props.member} memberType="class" attribute={this.props.attribute}/>
    } else {
      return (<div className="mdc-layout-grid">
        <div className="mdc-layout-grid__inner romajs-formrow">
          <div className="mdc-layout-grid__cell--span-3">
            <label>{i18n('Class Attributes')}</label>
            <p className="mdc-text-field-helper-text mdc-text-field-helper-text--persistent"
              dangerouslySetInnerHTML={{__html: i18n('HelperText')}} />
          </div>
          <div className="mdc-layout-grid__cell--span-8">
            <AttributesOnMember
              path={this.props.path}
              member={this.props.member}
              memberType={this.props.memberType}
              editAttribute={this.props.editAttribute}
              deleteMemberAttribute={this.props.deleteMemberAttribute}
              restoreMemberAttribute={this.props.restoreMemberAttribute}
              addMemberAttribute={this.props.addMemberAttribute} />
          </div>
        </div>
        <div className="mdc-layout-grid__inner romajs-formrow">
          <div className="mdc-layout-grid__cell--span-3">
            <label>{i18n('Class Membership')}</label>
            <p className="mdc-text-field-helper-text mdc-text-field-helper-text--persistent"
              dangerouslySetInnerHTML={{__html: i18n('HelperTextClass')}} />
          </div>
          <div className="mdc-layout-grid__cell--span-8">
            <AttClassAttPicker member={this.props.member.ident} message={
              <span>{i18nNotSeeing('q')}&nbsp;
                <Link to="/members" target="_blank">{i18nNotSeeing('Members Page')}</Link> {i18nNotSeeing('(opens in new tab)')}.</span>
            }/>
            <ul className="mdc-list mdc-list--two-line">{
              this.props.memberships.map((c, pos) => {
                let deleted = ''
                let content = <Link to={`/class/${c.ident}`}>{c.ident}</Link>
                if (c.mode === 'deleted' || c.mode === 'not available') {
                  deleted = 'romajs-att-deleted'
                  content = `${c.ident} (${c.mode})`
                }
                let button = (<i className={`${deleted} material-icons romajs-clickable`} tabIndex={0}
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && this.props.removeMembershipToClass(this.props.member.ident, c.ident)}
                  onClick={() => this.props.removeMembershipToClass(this.props.member.ident, c.ident)}>clear</i>)
                if (c.mode === 'deleted') {
                  button = (<i className="material-icons romajs-clickable" tabIndex={0}
                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && this.props.restoreMemberAttribute(this.props.member.ident, c.ident)}
                    onClick={() => this.props.addMembershipToClass(this.props.member.ident, c.ident)}>add_circle_outline</i>)
                } else if (c.mode === 'not available') {
                  button = ''
                }
                return (<li key={`c${pos}`} className="mdc-list-item">
                  <span className="mdc-list-item__graphic">{button}</span>
                  <span className={`mdc-list-item__text ${deleted}`}>
                    {content} [{c.attributes.map((at, ap) => {
                      const attDeleted = at.mode === 'deleted' ? 'romajs-att-deleted' : ''
                      return <span key={`at${ap}`} className={attDeleted}>&nbsp;{at.ident}&nbsp;</span>
                    })}]
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
            <label>{i18n('Member Classes')}</label>
            <p className="mdc-text-field-helper-text mdc-text-field-helper-text--persistent"
              dangerouslySetInnerHTML={{__html: i18n('HelperTextMembers')}} />
          </div>
          <div className="mdc-layout-grid__cell--span-8">
            <ul className="mdc-list mdc-list--two-line">{
              this.props.memberClasses.map((c, pos) => {
                let deleted = ''
                let content = <Link to={`/class/${c.ident}`}>{c.ident}</Link>
                if (c.mode === 'deleted' || c.deleted) {
                  deleted = 'romajs-att-deleted'
                  content = `${c.ident} (${i18n('not available')})`
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
}

ClassAttributes.propTypes = {
  path: PropTypes.string.isRequired,
  member: PropTypes.object.isRequired,
  memberType: PropTypes.string.isRequired,
  memberships: PropTypes.array.isRequired,
  attribute: PropTypes.string,
  memberClasses: PropTypes.array,
  editAttribute: PropTypes.func.isRequired,
  deleteMemberAttribute: PropTypes.func.isRequired,
  restoreMemberAttribute: PropTypes.func.isRequired,
  clearPicker: PropTypes.func.isRequired,
  navigateTo: PropTypes.func.isRequired,
  addMemberAttribute: PropTypes.func.isRequired,
  removeMembershipToClass: PropTypes.func.isRequired,
  addMembershipToClass: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired
}
