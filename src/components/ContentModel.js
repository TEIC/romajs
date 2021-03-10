import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ModelClassPicker from '../containers/ModelClassPicker'
import BlocklyContainer from '../containers/BlocklyContainer'
import { Link } from 'react-router-dom'

export default class ContentModel extends Component {
  render() {
    const sortedClasses = this.props.element.classes.model.slice(0).sort((a, b) => {
      return a.key > b.key
    })
    return (<div className="mdc-layout-grid">
      <div className="mdc-layout-grid__inner romajs-formrow">
        <div className="mdc-layout-grid__cell--span-3">
          <label>Model Classes</label>
          <p className="mdc-text-field-helper-text mdc-text-field-helper-text--persistent">
            Change model class membership here.
          </p>
        </div>
        <div className="mdc-layout-grid__cell--span-8">
          <ModelClassPicker member={this.props.element.ident} memberType={this.props.element.type} message={
            <span>Not seeing something you're looking for? Add it on the&nbsp;
              <Link to="/members" target="_blank">Members Page</Link> (opens in new tab).</span>
          }/>
          <ul className="mdc-list mdc-list--two-line">{
            sortedClasses.map((c, pos) => {
              return (<li key={`c${pos}`} className="mdc-list-item">
                <span className="mdc-list-item__graphic">
                  <i className="material-icons romajs-clickable" onClick={() =>
                    this.props.deleteElementModelClass(this.props.element.ident, c)}>clear</i>
                </span>
                <span className="mdc-list-item__text">
                  <span className="mdc-list-item__primary-text">{c}</span>
                  <span className="mdc-list-item__secondary-text">
                    {this.props.element.classDescs[c]}
                  </span>
                </span>
              </li>)
            })
          }</ul>
        </div>
      </div>
      <div className="mdc-layout-grid__inner romajs-formrow">
        <div className="mdc-layout-grid__cell--span-3">
          <label>Content</label>
          <p className="mdc-text-field-helper-text mdc-text-field-helper-text--persistent">
            Edit element content
          </p>
        </div>
        <div className="mdc-layout-grid__cell--span-8">
          <BlocklyContainer element={this.props.element}/>
        </div>
      </div>
    </div>)
  }
}

ContentModel.propTypes = {
  element: PropTypes.object,
  deleteElementModelClass: PropTypes.func,
  clearPicker: PropTypes.func
}
