import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Picker from './Picker'
import { MDCDialog } from '@material/dialog'

export default class ModalPicker extends Component {
  constructor(props) {
    super(props)
    this.state = {
      added: false
    }
  }

  componentDidMount() {
    this.dialog = new MDCDialog(this.refs.picker)
    this.dialog.listen('MDCDialog:cancel', () => {
      this.dialog.close()
    })
    this.dialog.show()
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!nextState.added) {
      this.dialog.show()
      return true
    } else {
      nextState.added = false
      return false
    }
  }

  addItem = (type, item) => {
    this.props.add(type, item)
    this.dialog.close()
    this.setState({added: true})
  }

  render() {
    return (<aside id="my-mdc-dialog" className="mdc-dialog" ref="picker">
      <div className="mdc-dialog__surface">
        <section id="my-mdc-dialog-description" className="mdc-dialog__body">
          <Picker showAll={true} items={this.props.items} pickerType={this.props.pickerType} add={this.addItem} />
        </section>
        <footer className="mdc-dialog__footer">
          <button type="button" className="mdc-button mdc-dialog__footer__button mdc-dialog__footer__button--cancel">
            Cancel
          </button>
        </footer>
      </div>
      <div className="mdc-dialog__backdrop"/>
    </aside>)
  }
}

ModalPicker.propTypes = {
  show: PropTypes.bool,
  items: PropTypes.array,
  pickerType: PropTypes.string,
  add: PropTypes.func
}
