import React, { Component } from 'react'
import PropTypes from 'prop-types'
import AttClassPicker from '../containers/AttClassPicker'
import EditAttribute from '../containers/EditAttribute'
import AttributesOnMember from './AttributesOnMember'
import { Link } from 'react-router-dom'
import { _i18n } from '../localization/i18n'

export default class Attributes extends Component {
  constructor(props) {
    super(props)
    this.state = {
      show: false
    }
  }

  render() {
    const i18n = _i18n(this.props.language, 'Attributes')
    const i18nNotSeeing = _i18n(this.props.language, 'NotSeeingMessage')
    if (this.props.attribute) {
      return <EditAttribute member={this.props.member} memberType="element" attribute={this.props.attribute}/>
    } else {
      return (<div className="mdc-layout-grid">
        <div className="mdc-layout-grid__inner romajs-formrow">
          <div className="mdc-layout-grid__cell--span-3">
            <label>{i18n(this.props.memberType)}</label>
            <p className="mdc-text-field-helper-text mdc-text-field-helper-text--persistent"
              dangerouslySetInnerHTML={{__html: i18n(`HelperText-${this.props.memberType}`)}} />
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
            <label>{i18n('Attribute From Classes')}</label>
            <p className="mdc-text-field-helper-text mdc-text-field-helper-text--persistent"
              dangerouslySetInnerHTML={{__html: i18n('HelperTextAtt')}} />
          </div>
          <div className="mdc-layout-grid__cell--span-8">
            <AttClassPicker element={this.props.member.ident} message={
              <span>{i18nNotSeeing('q')}&nbsp;
                <Link to="/members" target="_blank">{i18nNotSeeing('Members Page')}</Link> {i18nNotSeeing('(opens in new tab)')}.</span>
            }/>
            {this.props.attsfromClasses.map((cl, cpos) => {
              const noattributes = cl.noattributes
                ? <span key="noatt">{i18n(`This class doesn't define any attributes`)}</span>
                : ''
              let sub = ''
              if (cl.sub) {
                sub = `(${i18n('inherited from')} ${cl.from})`
              }
              let addRemove = (<i className="material-icons romajs-clickable" onClick={() =>
                this.props.deleteElementAttributeClass(this.props.member.ident, cl.ident)}>clear</i>)
              if (cl.inactive) {
                addRemove = (<i className="material-icons romajs-clickable" onClick={() =>
                  this.props.restoreElementAttributeClass(this.props.member.ident, cl.ident, Array.from(cl.deletedAttributes))}>add_circle_outline</i>)
              } else if (cl.noattributes) {
                addRemove = null
              }
              return [<h4 key={`clh${cpos}`}>{addRemove} {i18n('From')} <Link to={`/class/${cl.ident}`}>{cl.ident}</Link> {sub}</h4>,
                noattributes,
                (<ul className="mdc-list" key={`cl${cpos}`}>{
                  cl.attributes.map((a, pos) => {
                    let overridden = ''
                    let overriddenText = ''
                    if (a.overridden) {
                      overridden = 'romajs-att-overridden'
                      overriddenText = `(${i18n('changed for this element')})`
                    }
                    const deleted = a.deleted ? 'romajs-att-deleted' : ''
                    const noeffect = a.noeffect ? 'romajs-att-noeffect' : ''
                    let noeffectText = ''
                    if (a.noeffect) {
                      noeffectText = `(${i18n(`this change won't have any effect, check ODD source`)})`
                    }
                    let addOrRemove
                    if (a.deleted && a.deletedOnClass) {
                      addOrRemove = (<i className={`material-icons romajs-clickable`} onClick={() =>
                        this.props.restoreClassAttributeDeletedOnClass(this.props.member.ident, cl.ident, a.ident)}>add_circle_outline</i>)
                    } else if (a.deleted) {
                      addOrRemove = (<i className={`material-icons romajs-clickable`} onClick={() =>
                        this.props.restoreClassAttribute(this.props.member.ident, a.ident)}>add_circle_outline</i>)
                    } else if (!a.deleted && a.deletedOnClass) {
                      addOrRemove = (<i className={`material-icons romajs-clickable ${deleted}`} onClick={() =>
                        this.props.useClassDefault(this.props.member.ident, a.ident)}>clear</i>)
                    } else {
                      addOrRemove = (<i className={`material-icons romajs-clickable ${deleted}`} onClick={() =>
                        this.props.deleteClassAttribute(this.props.member.ident, cl.ident, a.ident)}>clear</i>)
                    }
                    return (<li key={`c${pos}`} className={`mdc-list-item ${overridden}`}>
                      <span className="mdc-list-item__graphic">
                        <i className={`material-icons romajs-clickable ${deleted}`}
                          onClick={() => this.props.editClassAttribute(this.props.member.ident, cl.ident, a.ident, this.props.path)}>mode_edit</i>
                        {addOrRemove}
                      </span>
                      <span className={`mdc-list-item__text ${deleted} ${noeffect}`}>
                        {a.ident} <em>{overriddenText} {noeffectText}</em>
                        <span className="mdc-list-item__secondary-text">
                          {a.shortDesc}
                        </span>
                      </span>
                    </li>)
                  })
                }</ul>)]
            })}
          </div>
        </div>
      </div>)
    }
  }
}

Attributes.propTypes = {
  path: PropTypes.string.isRequired,
  member: PropTypes.object.isRequired,
  memberType: PropTypes.string.isRequired,
  attribute: PropTypes.string,
  attsfromClasses: PropTypes.array,
  editAttribute: PropTypes.func.isRequired,
  editClassAttribute: PropTypes.func.isRequired,
  deleteMemberAttribute: PropTypes.func.isRequired,
  restoreMemberAttribute: PropTypes.func.isRequired,
  deleteElementAttributeClass: PropTypes.func.isRequired,
  restoreElementAttributeClass: PropTypes.func.isRequired,
  useClassDefault: PropTypes.func.isRequired,
  deleteClassAttribute: PropTypes.func.isRequired,
  restoreClassAttribute: PropTypes.func.isRequired,
  restoreClassAttributeDeletedOnClass: PropTypes.func.isRequired,
  clearPicker: PropTypes.func.isRequired,
  navigateTo: PropTypes.func.isRequired,
  addMemberAttribute: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired
}
