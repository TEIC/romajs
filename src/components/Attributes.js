import React, { Component } from 'react'
import PropTypes from 'prop-types'
import AttClassPicker from '../containers/AttClassPicker'
import EditAttribute from '../containers/EditAttribute'
import NewAttributeDialog from '../containers/NewAttributeDialog'

export default class Attributes extends Component {
  constructor(props) {
    super(props)
    this.state = {
      show: false
    }
  }

  render() {
    if (this.props.attribute) {
      return <EditAttribute member={this.props.element} attribute={this.props.attribute}/>
    } else {
      return (<div className="mdc-layout-grid">
        <div className="mdc-layout-grid__inner romajs-formrow">
          <div className="mdc-layout-grid__cell--span-3">
            <label>Element attributes</label>
            <p className="mdc-text-field-helper-text mdc-text-field-helper-text--persistent">
              Edit attributes defined on this element.
            </p>
          </div>
          <div className="mdc-layout-grid__cell--span-8">
            <i className="material-icons romajs-clickable" onClick={() => {
              this.setState({show: true})
            }}>add_circle_outline</i>
            <NewAttributeDialog show={this.state.show} element={this.props.element.ident}
              hide={() => {this.setState({show: false})}} />
            <ul className="mdc-list" key="elatts">{
              this.props.element.attributes.map((a, pos) => {
                if (a.mode === 'add' || (a.mode === 'delete' && a.onElement)) {
                  const deleted = a.deleted ? 'romajs-att-deleted' : ''
                  let addOrRemove
                  if (a.deleted) {
                    addOrRemove = (<i className={`material-icons romajs-clickable`} onClick={() =>
                      this.props.restoreElementAttribute(this.props.element.ident, a.ident)}>add_circle_outline</i>)
                  } else {
                    addOrRemove = (<i className={`material-icons romajs-clickable ${deleted}`} onClick={() =>
                      this.props.deleteElementAttribute(this.props.element.ident, a.ident)}>clear</i>)
                  }
                  return (<li key={`c${pos}`} className="mdc-list-item">
                    <span className="mdc-list-item__graphic">
                      <i className={`material-icons romajs-clickable ${deleted}`}
                        onClick={() => this.props.navigateTo(`${this.props.path}/${a.ident}`)}>
                        mode_edit</i>
                      {addOrRemove}
                    </span>
                    <span className="mdc-list-item__text">
                      {a.ident}
                      <span className="mdc-list-item__secondary-text">
                        {a.shortDesc}
                      </span>
                    </span>
                  </li>)
                } else return null
              })
            }</ul>
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
            <AttClassPicker element={this.props.element.ident}/>
            {this.props.attsfromClasses.map((cl, cpos) => {
              let sub = ''
              if (cl.sub) {
                sub = `(inherited from ${cl.from})`
              }
              let addRemove = (<i className="material-icons romajs-clickable" onClick={() =>
                this.props.deleteElementAttributeClass(this.props.element.ident, cl.ident)}>clear</i>)
              if (cl.inactive) {
                addRemove = (<i className="material-icons romajs-clickable" onClick={() =>
                  this.props.restoreElementAttributeClass(this.props.element.ident, cl.ident, Array.from(cl.deletedAttributes))}>add_circle_outline</i>)
              }
              return [<h4 key={`clh${cpos}`}>{addRemove} From {cl.ident} {sub}</h4>,
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
                        this.props.restoreClassAttributeDeletedOnClass(this.props.element.ident, cl.ident, a.ident)}>add_circle_outline</i>)
                    } else if (a.deleted) {
                      addOrRemove = (<i className={`material-icons romajs-clickable`} onClick={() =>
                        this.props.restoreClassAttribute(this.props.element.ident, a.ident)}>add_circle_outline</i>)
                    } else if (!a.deleted && a.deletedOnClass) {
                      addOrRemove = (<i className={`material-icons romajs-clickable ${deleted}`} onClick={() =>
                        this.props.useClassDefault(this.props.element.ident, a.ident)}>clear</i>)
                    } else {
                      addOrRemove = (<i className={`material-icons romajs-clickable ${deleted}`} onClick={() =>
                        this.props.deleteClassAttribute(this.props.element.ident, cl.ident, a.ident)}>clear</i>)
                    }
                    return (<li key={`c${pos}`} className={`mdc-list-item ${overridden}`}>
                      <span className="mdc-list-item__graphic">
                        <i className={`material-icons romajs-clickable ${deleted}`}
                          onClick={() => this.props.editAttribute(this.props.element.ident, cl.ident, a.ident, this.props.path)}>mode_edit</i>
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
  element: PropTypes.object,
  attribute: PropTypes.string,
  attsfromClasses: PropTypes.array,
  editAttribute: PropTypes.func.isRequired,
  deleteElementAttribute: PropTypes.func.isRequired,
  restoreElementAttribute: PropTypes.func.isRequired,
  deleteElementAttributeClass: PropTypes.func.isRequired,
  restoreElementAttributeClass: PropTypes.func.isRequired,
  useClassDefault: PropTypes.func.isRequired,
  deleteClassAttribute: PropTypes.func.isRequired,
  restoreClassAttribute: PropTypes.func.isRequired,
  restoreClassAttributeDeletedOnClass: PropTypes.func.isRequired,
  clearPicker: PropTypes.func.isRequired,
  navigateTo: PropTypes.func.isRequired
}
