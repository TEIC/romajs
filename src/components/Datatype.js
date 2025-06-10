import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Documentation from './Documentation'
import RevertDialog from './dialogs/Revert'
import DatatypeContent from './DatatypeContent'
import { _i18n } from '../localization/i18n'

export default class Datatype extends Component {
  constructor(props) {
    super(props)
    this.baseurl = `/datatype/${this.props.datatype.ident}`
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
    let content = null
    let trail
    let arrow
    const home = (<div className="romajs-squares">
      <ul className="mdc-image-list">
        <li className="mdc-image-list__item romajs-dtbackground">
          <div className="mdc-image-list__image-aspect-container romajs-clickable mdc-elevation--z3" tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && this.props.navigateTo(`${this.baseurl}/documentation`)}
            onClick={() => this.props.navigateTo(`${this.baseurl}/documentation`)}>
            <span>{i18n('Documentation')}</span>
          </div>
        </li>
        <li className="mdc-image-list__item romajs-dtbackground">
          <div className="mdc-image-list__image-aspect-container romajs-clickable mdc-elevation--z3" tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && this.props.navigateTo(`${this.baseurl}/content`)}
            onClick={() => this.props.navigateTo(`${this.baseurl}/content`)}>
            <span>{i18n('Content')}</span>
          </div>
        </li>
      </ul>
    </div>)
    // TODO: This is ugly! Re-organize this into proper components
    if (this.props.section) {
      arrow = <i className="material-icons">keyboard_arrow_left</i>
    }
    switch (this.props.section) {
      case 'documentation':
        content = <Documentation member={this.props.datatype} memberType="datatype" language={this.props.language} />
        trail = (<span className="mdc-chip">
          <span className="mdc-chip__text">{i18n('Documentation')}</span>
        </span>)
        break
      case 'content':
        content = (<DatatypeContent datatype={this.props.datatype}
          language={this.props.language}
          setDataRefRestriction={this.props.setDataRefRestriction}
          newDataRef={this.props.newDataRef}
          newTextNode={this.props.newTextNode}
          deleteDatatypeContent={this.props.deleteDatatypeContent}
          moveDatatypeContent={this.props.moveDatatypeContent}
          newDatatypeValList={this.props.newDatatypeValList}
          addDatatypeValItem={this.props.addDatatypeValItem}
          deleteDatatypeValItem={this.props.deleteDatatypeValItem}
          setDatatypeContentGrouping={this.props.setDatatypeContentGrouping} />)
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
      default:
        content = home
    }
    return [<div key="toolbar" className="mdc-toolbar--fixed mdc-toolbar__row romajs-toolbar2 romajs-dtbackground">
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
          <span className="mdc-chip__text">{this.props.datatype.ident}</span>
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
        <h1 className="mdc-typography--headline mdc-typography--headline4">{i18n('Datatype')} {this.props.datatype.ident}</h1>
        <h2 className="mdc-typography--headline mdc-typography--subtitle1">{this.props.datatype.shortDesc}</h2>
        {content}
      </div>
    </main>,
    <RevertDialog key="rd" show={this.state.showRevertDialog} hide={() => {this.setState({showRevertDialog: false})}}
      memberLabel={this.props.datatype.ident} member={this.props.datatype.ident} isNew={this.props.datatype._isNew || false}
      discard={(dt) => {this.props.discardChanges(dt)}} revert={(dt) => {this.props.revertToSource(dt)}}
      language={this.props.language} />
    ]
  }
}

Datatype.propTypes = {
  success: PropTypes.bool.isRequired,
  datatype: PropTypes.object.isRequired,
  section: PropTypes.string,
  navigateTo: PropTypes.func.isRequired,
  discardChanges: PropTypes.func.isRequired,
  revertToSource: PropTypes.func.isRequired,
  setDataRefRestriction: PropTypes.func.isRequired,
  newDataRef: PropTypes.func.isRequired,
  newTextNode: PropTypes.func.isRequired,
  deleteDatatypeContent: PropTypes.func.isRequired,
  moveDatatypeContent: PropTypes.func.isRequired,
  newDatatypeValList: PropTypes.func.isRequired,
  addDatatypeValItem: PropTypes.func.isRequired,
  deleteDatatypeValItem: PropTypes.func.isRequired,
  setDatatypeContentGrouping: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired,
}
