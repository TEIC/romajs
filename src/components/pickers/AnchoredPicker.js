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
    let picker = null
    if (this.state.visible) {
      picker = <ModalPicker show={this.state.visible} items={this.props.items} pickerType={this.props.pickerType} add={this.addItem} />
    }
    return (<div className="romajs-clickable">
      <i className="material-icons" onClick={this.show}>add_circle_outline</i>
      {picker}
    </div>)
  }
}

AnchoredPicker.propTypes = {
  items: PropTypes.array,
  pickerType: PropTypes.string,
  add: PropTypes.func
}
