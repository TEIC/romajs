import React, { Component } from 'react'
import PropTypes from 'prop-types'
import AttClassAttPicker from '../containers/AttClassAttPicker'
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
      return <EditAttribute member={this.props.member} attribute={this.props.attribute}/>
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
            <label>Class Membership</label>
            <p className="mdc-text-field-helper-text mdc-text-field-helper-text--persistent">
              The classes listed here inherit attributes from this class. Change class membership here.
            </p>
          </div>
          <div className="mdc-layout-grid__cell--span-8">
            <AttClassAttPicker member={this.props.member.ident}/>
            <ul className="mdc-list">
              {this.props.memberships.map((m, pos) => {
                let deleted = ''
                let content = <Link to={`/class/${m.ident}`}>{m.ident}</Link>
                if (m.mode === 'deleted') {
                  deleted = 'romajs-att-deleted'
                  content = `${m.ident} (deleted)`
                }
                return (<li key={`c${pos}`} className={`mdc-list-item ${deleted}`}>
                  <span className={`mdc-list-item__text`}>
                    {content}
                    <span className="mdc-list-item__secondary-text">
                      {m.shortDesc}
                    </span>
                  </span>
                </li>)
              })}
            </ul>
          </div>
        </div>
        <div className="mdc-layout-grid__inner romajs-formrow">
          <div className="mdc-layout-grid__cell--span-3">
            <label>Member Classes</label>
            <p className="mdc-text-field-helper-text mdc-text-field-helper-text--persistent">
              Attributes inherited from member classes. Click on class names to change their attributes and memberships.
            </p>
          </div>
          <div className="mdc-layout-grid__cell--span-8">
            <div/>
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
  memberships: PropTypes.array.isRequired,
  attribute: PropTypes.string,
  memberClasses: PropTypes.array,
  editAttribute: PropTypes.func.isRequired,
  editClassAttribute: PropTypes.func.isRequired,
  deleteMemberAttribute: PropTypes.func.isRequired,
  restoreMemberAttribute: PropTypes.func.isRequired,
  clearPicker: PropTypes.func.isRequired,
  navigateTo: PropTypes.func.isRequired,
  addMemberAttribute: PropTypes.func.isRequired
}
