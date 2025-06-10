import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Documentation from './Documentation'
import EditClassAttributes from '../containers/EditClassAttributes'
import EditModelClassMemberships from '../containers/EditModelClassMemberships'
import RevertDialog from './dialogs/Revert'
import { _i18n } from '../localization/i18n'

export default class Class extends Component {
  constructor(props) {
    super(props)
    this.baseurl = `/class/${this.props.klass.ident}`
    this.state = {
      showRevertDialog: false
    }
  }

  componentDidUpdate() {
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
    const i18n = _i18n(this.props.language, 'LandingPages')
    const typeLabel = this.props.klass.attributes ? i18n('Attribute class') : i18n('Model class')
    const type = this.props.klass.attributes ? 'attributes' : 'models'
    let content = null
    let trail
    let arrow
    let subArrow
    let mainSettings
    if (this.props.klass.attributes) {
      mainSettings = (<li className="mdc-image-list__item romajs-classbackground">
        <div className="mdc-image-list__image-aspect-container romajs-clickable mdc-elevation--z3" tabIndex={0}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && this.props.navigateTo(`${this.baseurl}/attributes`)}
          onClick={() => this.props.navigateTo(`${this.baseurl}/attributes`)}>
          <span>{i18n('Attributes')}</span>
        </div>
      </li>)
    } else {
      mainSettings = (<li className="mdc-image-list__item romajs-classbackground">
        <div className="mdc-image-list__image-aspect-container romajs-clickable mdc-elevation--z3" tabIndex={0}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && this.props.navigateTo(`${this.baseurl}/memberships`)}
          onClick={() => this.props.navigateTo(`${this.baseurl}/memberships`)}>
          <span>{i18n('Class Membership')}</span>
        </div>
      </li>)
    }
    const home = (<div className="romajs-squares">
      <ul className="mdc-image-list">
        <li className="mdc-image-list__item romajs-classbackground">
          <div className="mdc-image-list__image-aspect-container romajs-clickable mdc-elevation--z3" tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && this.props.navigateTo(`${this.baseurl}/documentation`)}
            onClick={() => this.props.navigateTo(`${this.baseurl}/documentation`)}>
            <span>{i18n('Documentation')}</span>
          </div>
        </li>
        {mainSettings}
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
        content = <Documentation member={this.props.klass} memberType="class" language={this.props.language}/>
        trail = (<span className="mdc-chip">
          <span className="mdc-chip__text">{i18n('Documentation')}</span>
        </span>)
        break
      case 'attributes':
        content = (<EditClassAttributes member={this.props.klass} attribute={this.props.attribute}/>)
        let editAtt
        if (this.props.attribute) {
          editAtt = (<span className="mdc-chip">
            <span className="mdc-chip__text">@{this.props.attribute}</span>
          </span>)
        }
        trail = (<span><span className="mdc-chip romajs-clickable" tabIndex={0}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && this.props.navigateTo(`${this.baseurl}/attributes`)}
          onClick={() => this.props.navigateTo(`${this.baseurl}/attributes`)}>
          <span className="mdc-chip__text">{i18n('Attributes')}</span>
          <i className="material-icons mdc-chip__icon mdc-chip__icon--leading">{subArrow}</i>
        </span>
        {editAtt}</span>)
        break
      case 'memberships':
        content = (<EditModelClassMemberships member={this.props.klass} />)
        trail = (<span className="mdc-chip">
          <span className="mdc-chip__text">{i18n('Content')}</span>
        </span>)
        break
      case 'constraints':
        content = (<h1 className="mdc-typography--headline" style={{color: '#225688'}}>{i18n('Not available.')}</h1>)
        trail = (<span className="mdc-chip">
          <span className="mdc-chip__text">{i18n('Contraints')}</span>
        </span>)
        break
      case 'processing':
        content = (<h1 className="mdc-typography--headline" style={{color: '#225688'}}>{i18n('Not available.')}</h1>)
        trail = (<span className="mdc-chip">
          <span className="mdc-chip__text">{i18n('Processing Model')}</span>
        </span>)
        break
      default:
        content = home
    }
    return [<div key="toolbar" className="mdc-toolbar--fixed mdc-toolbar__row romajs-toolbar2 romajs-classbackground">
      <section className="mdc-toolbar__section mdc-toolbar__section--align-start">
        <span className="mdc-chip romajs-clickable" tabIndex={0}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && this.goBack(e)}
          onClick={this.goBack}>
          <span className="mdc-chip__text">{i18n('Members')}</span>
          <i className="material-icons mdc-chip__icon mdc-chip__icon--leading">keyboard_arrow_left</i>
        </span>
        <span className="mdc-chip romajs-clickable" tabIndex={0}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && this.props.navigateTo(this.baseurl)}
          onClick={() => this.props.navigateTo(this.baseurl)}>
          <span className="mdc-chip__text">{this.props.klass.ident}</span>
          <i className="material-icons mdc-chip__icon mdc-chip__icon--leading">{arrow}</i>
        </span>
        {trail}
      </section>
      <section className="mdc-toolbar__section mdc-toolbar__section--align-end">
        <span className="mdc-chip" tabIndex={0}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && this.setState({showRevertDialog: true})}
          onClick={() => this.setState({showRevertDialog: true})}>
          <i className="material-icons mdc-chip__icon mdc-chip__icon--leading">undo</i>
          <span className="mdc-chip__text">{i18n('Revert to source')}</span>
        </span>
      </section>
    </div>,
    <main key="main">
      <div className="romajs-form">
        <h1 className="mdc-typography--headline mdc-typography--headline4">{typeLabel} {this.props.klass.ident}</h1>
        <h2 className="mdc-typography--headline mdc-typography--subtitle1">{this.props.klass.shortDesc}</h2>
        {content}
      </div>
    </main>,
    <RevertDialog key="rd" show={this.state.showRevertDialog} hide={() => {this.setState({showRevertDialog: false})}}
      memberLabel={this.props.klass.ident} member={this.props.klass.ident} isNew={this.props.klass._isNew || false}
      discard={(cl) => {this.props.discardChanges(cl, type)}} revert={(cl) => {this.props.revertToSource(cl, type)}}
      language={this.props.language} />
    ]
  }
}

Class.propTypes = {
  success: PropTypes.bool.isRequired,
  klass: PropTypes.object.isRequired,
  section: PropTypes.string,
  attribute: PropTypes.string,
  navigateTo: PropTypes.func.isRequired,
  discardChanges: PropTypes.func.isRequired,
  revertToSource: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired,
}
