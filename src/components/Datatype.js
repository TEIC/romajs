import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Documentation from './Documentation'
import RevertDialog from './dialogs/Revert'

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
    let content = null
    let trail
    let arrow
    const home = (<div className="romajs-squares">
      <ul className="mdc-image-list">
        <li className="mdc-image-list__item romajs-dtbackground">
          <div className="mdc-image-list__image-aspect-container romajs-clickable"
            onClick={() => this.props.navigateTo(`${this.baseurl}/documentation`)}>
            <span>Documentation</span>
          </div>
        </li>
        <li className="mdc-image-list__item romajs-dtbackground">
          <div className="mdc-image-list__image-aspect-container romajs-clickable"
            onClick={() => this.props.navigateTo(`${this.baseurl}/content`)}>
            <span>Content</span>
          </div>
        </li>
        <li className="mdc-image-list__item romajs-dtbackground">
          <div className="mdc-image-list__image-aspect-container romajs-clickable"
            onClick={() => this.props.navigateTo(`${this.baseurl}/constraints`)}>
            <span>Constraints</span>
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
        content = <Documentation member={this.props.datatype} memberType="datatype"/>
        trail = (<span className="mdc-chip">
          <span className="mdc-chip__text">Documentation</span>
        </span>)
        break
      case 'constraints':
        content = (<h1 className="mdc-typography--headline" style={{color: '#225688'}}>Coming soon.</h1>)
        trail = (<span className="mdc-chip">
          <span className="mdc-chip__text">Contraints</span>
        </span>)
        break
      default:
        content = home
    }
    return [<div key="toolbar" className="mdc-toolbar--fixed mdc-toolbar__row romajs-toolbar2 romajs-dtbackground">
      <section className="mdc-toolbar__section mdc-toolbar__section--align-start">
        <span className="mdc-chip romajs-clickable" onClick={this.goBack}>
          <span className="mdc-chip__text">Members</span>
          <i className="material-icons mdc-chip__icon mdc-chip__icon--leading">keyboard_arrow_left</i>
        </span>
        <span className="mdc-chip romajs-clickable" onClick={() => this.props.navigateTo(this.baseurl)}>
          <span className="mdc-chip__text">{this.props.datatype.ident}</span>
          <i className="material-icons mdc-chip__icon mdc-chip__icon--leading">{arrow}</i>
        </span>
        {trail}
      </section>
      <section className="mdc-toolbar__section mdc-toolbar__section--align-end">
        <span className="mdc-chip" onClick={() => {
          this.setState({showRevertDialog: true})
        }}>
          <i className="material-icons mdc-chip__icon mdc-chip__icon--leading">undo</i>
          <span className="mdc-chip__text">Revert to source</span>
        </span>
      </section>
    </div>,
    <main key="main">
      <div className="romajs-form">
        <h1 className="mdc-typography--headline mdc-typography--headline4">Datatype {this.props.datatype.ident}</h1>
        <h2 className="mdc-typography--headline mdc-typography--subtitle1">{this.props.datatype.shortDesc}</h2>
        {content}
      </div>
    </main>,
    <RevertDialog key="rd" show={this.state.showRevertDialog} hide={() => {this.setState({showRevertDialog: false})}}
      memberLabel={this.props.datatype.ident} member={this.props.datatype.ident} isNew={this.props.datatype._isNew || false}
      discard={(cl) => {this.props.discardChanges(cl)}} revert={(cl) => {this.props.revertToSource(cl)}} />
    ]
  }
}

Datatype.propTypes = {
  success: PropTypes.bool.isRequired,
  datatype: PropTypes.object.isRequired,
  section: PropTypes.string,
  navigateTo: PropTypes.func.isRequired,
  discardChanges: PropTypes.func.isRequired,
  revertToSource: PropTypes.func.isRequired
}
