import React from 'react'
import PropTypes from 'prop-types'
import { Component } from 'react'
// import { Route } from 'react-router-dom'
import Header from './Header'
import Members from '../containers/Members'
// import FilterSearch from '../containers/FilterSearch'
// import ElementPage from '../containers/ElementPage'

class AppBody extends Component {
  render() {
    return (<div>
      <Header uploadCustomization={this.props.uploadCustomization} onDownloadClick={this.props.onDownloadClick} odd={this.props.odd}/>
      <div className="romajs-content">
        <main className="romajs-main">
          <Members/>
        </main>
      </div>
    </div>)
  }
}

AppBody.propTypes = {
  uploadCustomization: PropTypes.func.isRequired,
  onDownloadClick: PropTypes.func.isRequired,
  odd: PropTypes.object
}

export default AppBody
