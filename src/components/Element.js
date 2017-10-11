import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
// import {MDCTextfield} from '@material/textfield'

export default class Element extends Component {
  constructor(props) {
    super(props)
    this.state = {altIdent: props.element.altIdent}
    this.changeIdent = this.changeIdent.bind(this)
  }

  componentWillMount() {
    if (!this.props.success) {
      this.props.redirect()
    }
  }

  // componentDidMount() {
  //   const textfield = new MDCTextfield(this.refs.textfield)
  //   textfield
  // }

  changeIdent(event) {
    this.setState({altIdent: event.target.value})
  }

  render() {
    if (!this.props.success) {
      return null
    }
    return (<div className="romajs-form">
      <h1 className="mdc-typography--headline">&lt;{this.props.element.ident}&gt;</h1>

      <label htmlFor="fouc">Alternative identifier</label>
      <div className="mdc-textfield mdc-textfield--upgraded">
        <input id="fouc" type="text" className="mdc-textfield__input" value={this.state.altIdent} onChange={this.changeIdent}/>
        <div className="mdc-textfield__bottom-line" style={{transformOrigin: '145px center'}}/>
      </div>
      <p className="mdc-textfield-helptext mdc-textfield-helptext--persistent">
        All documentation elements in ODD have a canonical name, supplied as the value for their ident attribute.
        <br/>The altIdent element is used to supply an alternative name for the corresponding XML object, perhaps in a different language.
      </p>

      <label htmlFor="textarea">Description</label>
      <div className="romajs-textfield mdc-textfield mdc-textfield--textarea mdc-textfield--upgraded">
        <textarea id="textarea" className="mdc-textfield__input" rows="8" cols="40" value={this.props.element.desc[0]}/>
      </div>

      <div><Link to="/">Back</Link></div>
    </div>)
  }
}

Element.propTypes = {
  success: PropTypes.bool,
  element: PropTypes.object,
  redirect: PropTypes.func
}
