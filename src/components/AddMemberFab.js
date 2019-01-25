import React, { Component } from 'react'
// import PropTypes from 'prop-types'

export default class AddMemberFab extends Component {
  constructor(props) {
    super(props)
    this.state = { expanded: false }
  }

  toggle() {
    if (this.state.expanded) {
      this.setState({expanded: false})
    } else {
      this.setState({expanded: true})
    }
  }

  render() {
    let members = null
    if (this.state.expanded) {
      members = [
        (<button key="el" className="mdc-fab mdc-fab--extended romajs-fab--absolute romajs-fab--secondary-el">
          <span className="mdc-fab__label">Element</span>
        </button>),
        (<button key="cl" className="mdc-fab mdc-fab--extended romajs-fab--absolute romajs-fab--secondary-cl">
          <span className="mdc-fab__label">Class</span>
        </button>),
      ]
    }
    return (
      <div id="romajs-fab">
        <button key="new" className="mdc-fab mdc-fab--extended romajs-fab--absolute" onClick={() => {this.toggle()}}>
          <span className="mdc-fab__label">New</span>
          <span className="mdc-fab__icon material-icons">library_add</span>
        </button>
        {members}
      </div>
    )
  }
}

// AddMemberFab.propTypes = {}
