import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ModalPicker from './ModalPicker'

export default class AnchoredPicker extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false
    }
  }

  hide = () => {
    this.setState({visible: false})
  }

  show = () => {
    this.setState({visible: true})
  }

  addItem = (type, item) => {
    this.hide()
    this.props.add(type, item)
  }

  render() {
    return (<div className="romajs-clickable">
      <i className="material-icons" onClick={this.show}>add_circle_outline</i>
      <ModalPicker items={this.props.items} pickerType={this.props.pickerType} add={this.addItem}
        visible={this.state.visible} cancel={this.hide} message={this.props.message}/>
    </div>)
  }
}

AnchoredPicker.propTypes = {
  items: PropTypes.array,
  pickerType: PropTypes.string,
  add: PropTypes.func,
  message: PropTypes.string
}
