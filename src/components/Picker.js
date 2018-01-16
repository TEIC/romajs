import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class Picker extends Component {
  constructor(props) {
    super(props)
    this.state = {
      filterTerm: ''
    }
  }

  show = (e) => {
    e.target.style.display = 'none'
    this.refs.pickerList.style.display = 'block'
  }

  hide = () => {
    this.refs.pickerList.style.display = 'none'
    this.refs.showPicker.style.display = 'inline-block'
    this.setState({filterTerm: ''})
  }

  setFilterTerm = (e) => {
    this.setState({filterTerm: e.target.value})
  }

  addItem = (item) => {
    this.props.add(this.props.pickerType, item)
    this.hide()
  }

  render() {
    return (<div className="romajs-clickable romajs-editable-list-add">
      <i className="material-icons" onClick={this.show} ref="showPicker">add_circle_outline</i>
      <div style={{display: 'none'}} ref="pickerList">
        <i className="material-icons" onClick={this.hide}>clear</i>
        <div className="mdc-text-field mdc-text-field--outlined">
          <input className="mdc-text-field__input" placeholder="Find class" type="text"
            value={this.state.filterTerm}
            onChange={this.setFilterTerm}/>
        </div>
        <ul className="mdc-list mdc-list--dense romajs-picker">{
          this.props.items.map((c, pos) => {
            const t = this.state.filterTerm.toLowerCase()
            if (t !== '' && c.ident.toLowerCase().match(t)) {
              return (<li className="mdc-list-item" key={`c${pos}`}>
                <span className="mdc-list-item__graphic" onClick={() => this.addItem(c)}>
                  <i className="material-icons">add_circle_outline</i>
                </span>
                {c.ident}
              </li>)
            } else return null
          })
        }</ul>
      </div>
    </div>)
  }
}

Picker.propTypes = {
  items: PropTypes.array,
  pickerType: PropTypes.string,
  add: PropTypes.func
}
