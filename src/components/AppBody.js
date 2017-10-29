import React from 'react'
import PropTypes from 'prop-types'
import { Component } from 'react'
import { Route } from 'react-router-dom'
import Header from './Header'
import HomePage from '../containers/HomePage'
import Members from '../containers/Members'
import ElementPage from '../containers/ElementPage'

class AppBody extends Component {
  render() {
    return (<div className="mdc-typography">
      <Header
        location={this.props.location}
        downloadCustomization={this.props.downloadCustomization}
        downloadRng={this.props.downloadRng}
        downloadW3c={this.props.downloadW3c}
        odd={this.props.odd} />
      <div className="romajs-content">
        <main className="romajs-main">
          <Route exact path="/" component={HomePage} />
          <Route exact path="/members" component={Members} />
          <Route exact path="/element/:el" component={ElementPage} />
        </main>
      </div>
    </div>)
  }
}

AppBody.propTypes = {
  location: PropTypes.string,
  downloadCustomization: PropTypes.func.isRequired,
  downloadRng: PropTypes.func.isRequired,
  downloadW3c: PropTypes.func.isRequired,
  odd: PropTypes.object
}

export default AppBody
