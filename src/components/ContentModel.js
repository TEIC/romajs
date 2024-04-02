import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ModelClassPicker from '../containers/ModelClassPicker'
import BlocklyContainer from '../containers/BlocklyContainer'
import { Link } from 'react-router-dom'
import { _i18n } from '../localization/i18n'

export default class ContentModel extends Component {
  render() {
    const i18n = _i18n(this.props.language, 'ContentModel')
    const i18nNotSeeing = _i18n(this.props.language, 'NotSeeingMessage')
    const sortedClasses = this.props.element.classes.model.slice(0).sort((a, b) => {
      return a.key > b.key
    })
    return (<div className="mdc-layout-grid">
      <div className="mdc-layout-grid__inner romajs-formrow">
        <div className="mdc-layout-grid__cell--span-3">
          <label>{i18n('Model Classes')}</label>
          <p className="mdc-text-field-helper-text mdc-text-field-helper-text--persistent"
            dangerouslySetInnerHTML={{__html: i18n('HelperText')}} />
        </div>
        <div className="mdc-layout-grid__cell--span-8">
          <ModelClassPicker member={this.props.element.ident} memberType={this.props.element.type} message={
            <span>{i18nNotSeeing('q')}&nbsp;
              <Link to="/members" target="_blank">{i18nNotSeeing('Members Page')}</Link> {i18nNotSeeing('(opens in new tab)')}.</span>
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
          <label>{i18n('Content')}</label>
          <p className="mdc-text-field-helper-text mdc-text-field-helper-text--persistent"
            dangerouslySetInnerHTML={{__html: i18n('HelperTextContent')}} />
          <h3 className="mdc-typography mdc-typography--subtitle2"
            dangerouslySetInnerHTML={{__html: i18n('ExtendedHelperTextTitle')}} />
          <p className="mdc-text-field-helper-text mdc-text-field-helper-text--persistent"
            dangerouslySetInnerHTML={{__html: i18n('ExtendedHelperText')}} />
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
  clearPicker: PropTypes.func,
  language: PropTypes.string.isRequired,
}
