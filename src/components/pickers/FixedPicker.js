import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Picker from './Picker'

export default class FixedPicker extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false
    }
  }

  show = () => {
    this.setState({visible: true})
  }

  hide = () => {
    this.setState({visible: false})
  }

  addItem = (type, item) => {
    this.props.add(type, item)
    this.hide()
  }

  render() {
    let icon = <i className="material-icons" onClick={this.show}>add_circle_outline</i>
    let visible = {display: 'none'}
    if (this.state.visible) {
      icon = <i className="material-icons" style={{float: 'left'}} onClick={this.hide}>clear</i>
      visible = {display: 'inline-block'}
    }
    return (<div className="romajs-clickable">
      {icon}
      <div style={visible}>
        <Picker items={this.props.items} pickerType={this.props.pickerType} add={this.addItem} />
      </div>
    </div>)
  }
}

FixedPicker.propTypes = {
  items: PropTypes.array,
  pickerType: PropTypes.string,
  add: PropTypes.func
}
