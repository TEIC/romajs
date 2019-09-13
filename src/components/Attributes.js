import React, { Component } from 'react'
import PropTypes from 'prop-types'
import AttClassPicker from '../containers/AttClassPicker'
import EditAttribute from '../containers/EditAttribute'
import AttributesOnMember from './AttributesOnMember'
import { Link } from 'react-router-dom'

export default class Attributes extends Component {
  constructor(props) {
    super(props)
    this.state = {
      show: false
    }
  }

  render() {
    if (this.props.attribute) {
      return <EditAttribute member={this.props.member} memberType="element" attribute={this.props.attribute}/>
    } else {
      return (<div className="mdc-layout-grid">
        <div className="mdc-layout-grid__inner romajs-formrow">
          <div className="mdc-layout-grid__cell--span-3">
            <label>{this.props.memberType[0].toUpperCase() + this.props.memberType.substring(1)} attributes</label>
            <p className="mdc-text-field-helper-text mdc-text-field-helper-text--persistent">
              Edit attributes defined on this {this.props.memberType}.
            </p>
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
            <label>Attribute From Classes</label>
            <p className="mdc-text-field-helper-text mdc-text-field-helper-text--persistent">
              Elements can be members of attribute classes to inherit the attributes defined in a class. Here you can:
            </p>
            <ul className="mdc-text-field-helper-text mdc-text-field-helper-text--persistent">
              <li>Edit class attributes for this element only</li>
              <li>Delete / restore class attributes for this element only</li>
              <li>Change class memberships</li>
            </ul>
          </div>
          <div className="mdc-layout-grid__cell--span-8">
            <AttClassPicker message={
              <span>Not seeing something you're looking for? Add it on the&nbsp;
                <Link to="/members" target="_blank">Members Page</Link> (opens in new tab).</span>
            }/>
            {this.props.attsfromClasses.map((cl, cpos) => {
              let sub = ''
              if (cl.sub) {
                sub = `(inherited from ${cl.from})`
              }
              let addRemove = (<i className="material-icons romajs-clickable" onClick={() =>
                this.props.deleteElementAttributeClass(this.props.member.ident, cl.ident)}>clear</i>)
              if (cl.inactive) {
                addRemove = (<i className="material-icons romajs-clickable" onClick={() =>
                  this.props.restoreElementAttributeClass(this.props.member.ident, cl.ident, Array.from(cl.deletedAttributes))}>add_circle_outline</i>)
              }
              return [<h4 key={`clh${cpos}`}>{addRemove} From <Link to={`/class/${cl.ident}`}>{cl.ident}</Link> {sub}</h4>,
                (<ul className="mdc-list" key={`cl${cpos}`}>{
                  cl.attributes.map((a, pos) => {
                    let overridden = ''
                    let overriddenText = ''
                    if (a.overridden) {
                      overridden = 'romajs-att-overridden'
                      overriddenText = '(changed for this element)'
                    }
                    const deleted = a.deleted ? 'romajs-att-deleted' : ''
                    const noeffect = a.noeffect ? 'romajs-att-noeffect' : ''
                    let noeffectText = ''
                    if (a.noeffect) {
                      noeffectText = '(this change won\'t have any effect, check ODD source)'
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
  addMemberAttribute: PropTypes.func.isRequired
}
