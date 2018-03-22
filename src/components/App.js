import React from 'react'
import { Component } from 'react'
import { Route } from 'react-router-dom'
import HeaderContainer from '../containers/HeaderContainer'
import HomePage from '../containers/HomePage'
import Members from '../containers/Members'
import ElementPage from '../containers/ElementPage'

class App extends Component {
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
    </div>)
  }
}

export default App
