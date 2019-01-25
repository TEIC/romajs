import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Documentation from './Documentation'
import EditAttributes from '../containers/EditAttributes'
import ContentModel from './ContentModel'

export default class Element extends Component {
  constructor(props) {
    super(props)
    this.baseurl = `/element/${this.props.element.ident}`
  }

  componentWillMount() {
    if (!this.props.success) {
      this.props.navigateTo('/members')
    }
  }

  goBack = (event) => {
    event.preventDefault()
    this.props.navigateTo('/members')
  }

  render() {
    if (!this.props.success) {
      return null
    }
    let content = null
    let trail
    let arrow
    let subArrow
    const home = (<div className="romajs-squares">
      <ul className="mdc-image-list">
        <li className="mdc-image-list__item">
          <div className="mdc-image-list__image-aspect-container romajs-clickable"
            onClick={() => this.props.navigateTo(`${this.baseurl}/documentation`)}>
            <span>Documentation</span>
          </div>
        </li>
        <li className="mdc-image-list__item">
          <div className="mdc-image-list__image-aspect-container romajs-clickable"
            onClick={() => this.props.navigateTo(`${this.baseurl}/attributes`)}>
            <span>Attributes</span>
          </div>
        </li>
        <li className="mdc-image-list__item">
          <div className="mdc-image-list__image-aspect-container romajs-clickable"
            onClick={() => this.props.navigateTo(`${this.baseurl}/content`)}>
            <span>Class Membership <br/> &amp; Content Model</span>
          </div>
        </li>
        <li className="mdc-image-list__item">
          <div className="mdc-image-list__image-aspect-container romajs-clickable"
            onClick={() => this.props.navigateTo(`${this.baseurl}/constraints`)}>
            <span>Constraints</span>
          </div>
        </li>
        <li className="mdc-image-list__item">
          <div className="mdc-image-list__image-aspect-container romajs-clickable"
            onClick={() => this.props.navigateTo(`${this.baseurl}/processing`)}>
            <span>Processing Model</span>
          </div>
        </li>
      </ul>
    </div>)
    // TODO: This is ugly! Re-organize this into proper components
    if (this.props.section) {
      arrow = <i className="material-icons">keyboard_arrow_left</i>
    }
    if (this.props.attribute) {
      subArrow = <i className="material-icons">keyboard_arrow_left</i>
    }
    switch (this.props.section) {
      case 'documentation':
        content = <Documentation member={this.props.element}  memberType="element"/>
        trail = (<span className="mdl-chip mdl-chip--deletable">
          <span className="mdl-chip__text">Documentation</span>
        </span>)
        break
      case 'attributes':
        content = (<EditAttributes element={this.props.element} attribute={this.props.attribute}/>)
        let editAtt
        if (this.props.attribute) {
          editAtt = (<span className="mdl-chip mdl-chip--deletable">
            <span className="mdl-chip__text">@{this.props.attribute}</span>
          </span>)
        }
        trail = (<span><span className="mdl-chip mdl-chip--deletable romajs-clickable" onClick={() => this.props.navigateTo(`${this.baseurl}/attributes`)}>
          <span className="mdl-chip__text">Attributes</span>
          <span className="mdl-chip__action">
            {subArrow}
          </span>
        </span>
        {editAtt}</span>)
        break
      case 'content':
        content = (<ContentModel
          element={this.props.element}
          deleteElementModelClass={this.props.deleteElementModelClass}
          clearPicker={this.props.clearPicker} />)
        trail = (<span className="mdl-chip mdl-chip--deletable">
          <span className="mdl-chip__text">Content</span>
        </span>)
        break
      case 'constraints':
        content = (<h1 className="mdc-typography--headline" style={{color: '#225688'}}>Coming soon.</h1>)
        trail = (<span className="mdl-chip mdl-chip--deletable">
          <span className="mdl-chip__text">Contraints</span>
        </span>)
        break
      case 'processing':
        content = (<h1 className="mdc-typography--headline" style={{color: '#225688'}}>Coming soon.</h1>)
        trail = (<span className="mdl-chip mdl-chip--deletable">
          <span className="mdl-chip__text">Processing Model</span>
        </span>)
        break
      default:
        content = home
    }
    return [<div key="toolbar" className="mdc-toolbar--fixed mdc-toolbar__row romajs-toolbar2">
      <section className="mdc-toolbar__section mdc-toolbar__section--align-start">
        <span className="mdl-chip mdl-chip--deletable romajs-clickable" onClick={this.goBack}>
          <span className="mdl-chip__text">Members</span>
          <span className="mdl-chip__action">
            <i className="material-icons">keyboard_arrow_left</i>
          </span>
        </span>
        <span className="mdl-chip mdl-chip--deletable romajs-clickable" onClick={() => this.props.navigateTo(this.baseurl)}>
          <span className="mdl-chip__text">&lt;{this.props.element.ident}&gt;</span>
          <span className="mdl-chip__action">
            {arrow}
          </span>
        </span>
        {trail}
      </section>
      <section className="mdc-toolbar__section mdc-toolbar__section--align-end">
        <span className="mdl-chip mdl-chip--deletable">
          <span className="mdl-chip__text">Revert to source</span>
          <button type="button" className="mdl-chip__action">
            <i className="material-icons">undo</i>
          </button>
        </span>
      </section>
    </div>,
    <main key="main">
      <div className="romajs-form">
        <h1 className="mdc-typography--headline mdc-typography--headline4">&lt;{this.props.element.ident}&gt;</h1>
        <h2 className="mdc-typography--headline mdc-typography--subtitle1">{this.props.element.shortDesc}</h2>
        {content}
      </div>
    </main>]
  }
}

Element.propTypes = {
  success: PropTypes.bool.isRequired,
  element: PropTypes.object.isRequired,
  section: PropTypes.string,
  attribute: PropTypes.string,
  navigateTo: PropTypes.func.isRequired,
  clearPicker: PropTypes.func.isRequired,
  deleteElementModelClass: PropTypes.func.isRequired
}
