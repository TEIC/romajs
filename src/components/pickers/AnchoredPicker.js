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
    let icon = 'add_circle_outline'
    if (this.props.icon) {
      icon = this.props.icon
    }
    return (<div className="romajs-clickable">
      <i className="material-icons" tabIndex={0}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && this.show()}
        onClick={this.show}>{icon}</i>
      <ModalPicker items={this.props.items} pickerType={this.props.pickerType} add={this.addItem}
        visible={this.state.visible} cancel={this.hide} message={this.props.message} language={this.props.language}/>
    </div>)
  }
}

AnchoredPicker.propTypes = {
  items: PropTypes.array,
  pickerType: PropTypes.string,
  add: PropTypes.func,
  message: PropTypes.object,
  icon: PropTypes.string,
  language: PropTypes.string.isRequired
}
