import React, { Component } from 'react'
import CreateNewElement from '../containers/CreateNewElement'
import CreateNewClass from '../containers/CreateNewClass'
import CreateNewDatatype from '../containers/CreateNewDatatype'

export default class AddMemberFab extends Component {
  constructor(props) {
    super(props)
    this.state = {
      expanded: false,
      type: 'element',
      showDialog: false
    }
  }

  toggle() {
    if (this.state.expanded) {
      this.setState({expanded: false})
    } else {
      this.setState({expanded: true})
    }
  }

  render() {
    let dialog = null
    switch (this.state.type) {
      case 'element':
        dialog = (<CreateNewElement
          show={this.state.showDialog} hide={() => {this.setState({showDialog: false})}} />)
        break
      case 'class':
        dialog = (<CreateNewClass
          show={this.state.showDialog} hide={() => {this.setState({showDialog: false})}} />)
        break
      case 'datatype':
        dialog = (<CreateNewDatatype
          show={this.state.showDialog} hide={() => {this.setState({showDialog: false})}} />)
        break
      default:
        // noop
    }
    let members = null
    if (this.state.expanded) {
      members = [
        (<button key="el" className="mdc-fab mdc-fab--extended romajs-fab--absolute romajs-fab--secondary-el"
          onClick={() => {this.setState({type: 'element', showDialog: true, expanded: false})}}>
          <span className="mdc-fab__label">Element</span>
        </button>),
        (<button key="cl" className="mdc-fab mdc-fab--extended romajs-fab--absolute romajs-fab--secondary-cl"
          onClick={() => {this.setState({type: 'class', showDialog: true, expanded: false})}}>
          <span className="mdc-fab__label">Class</span>
        </button>),
        (<button key="dt" className="mdc-fab mdc-fab--extended romajs-fab--absolute romajs-fab--secondary-dt"
          onClick={() => {this.setState({type: 'datatype', showDialog: true, expanded: false})}}>
          <span className="mdc-fab__label">Datatype</span>
        </button>),
      ]
    }
    return (
      <div id="romajs-fab">
        {dialog}
        <button key="new" className="mdc-fab mdc-fab--extended romajs-fab--absolute" onClick={() => {this.toggle()}}>
          <span className="mdc-fab__label">New</span>
          <span className="mdc-fab__icon material-icons">library_add</span>
        </button>
        {members}
      </div>
    )
  }
}
