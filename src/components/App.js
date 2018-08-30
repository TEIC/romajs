import React from 'react'
import { Component } from 'react'
import { Route } from 'react-router-dom'
import HeaderContainer from '../containers/HeaderContainer'
import HomePage from '../containers/HomePage'
import Members from '../containers/Members'
import ElementPage from '../containers/ElementPage'
import ErrorReportingDialog from '../containers/ErrorReportingDialog'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showErrorDialog: false,
      errorMsg: ''
    }
  }

  componentDidMount() {
    window.onerror = (error) => {
      this.setState({showErrorDialog: true, errorMsg: error})
    }
  }

  render() {
    return (<div className="mdc-typography">
      <HeaderContainer />
      <div className="romajs-content">
        <Route exact path="/" component={HomePage} />
        <Route exact path="/members" component={Members} />
        <Route exact path="/element/:el" component={ElementPage} />
        <Route exact path="/element/:el/:section" component={ElementPage} />
        <Route exact path="/element/:el/attributes/:attr" component={ElementPage} />
      </div>
      <ErrorReportingDialog show={this.state.showErrorDialog} error={this.state.errorMsg}
        hide={() => {this.setState({showErrorDialog: false})}}/>
    </div>)
  }
}

export default App
