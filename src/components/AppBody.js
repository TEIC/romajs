import React from 'react'
import PropTypes from 'prop-types'
import { Component } from 'react'
import { Route } from 'react-router-dom'
import Header from './Header'
import Members from '../containers/Members'
import ElementPage from '../containers/ElementPage'

class AppBody extends Component {
  render() {
    return (<div>
      <Header uploadCustomization={this.props.uploadCustomization} downloadCustomization={this.props.downloadCustomization} odd={this.props.odd}/>
      <div className="romajs-content">
        <main className="romajs-main">
          <Route exact path="/" component={Members} />
          <Route exact path="/element/:el" component={ElementPage} />
        </main>
      </div>
    </div>)
  }
}

AppBody.propTypes = {
  uploadCustomization: PropTypes.func.isRequired,
  downloadCustomization: PropTypes.func.isRequired,
  odd: PropTypes.object
}

export default AppBody
