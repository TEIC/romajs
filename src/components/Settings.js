import React from 'react'
import PropTypes from 'prop-types'
import { Component } from 'react'
import { MDCSelect } from '@material/select'
import { _i18n } from '../localization/i18n'

export default class Settings extends Component {
  componentDidMount() {
    const tlSelect = new MDCSelect(this.refs.targetLang)
    switch (this.props.targetLang) {
      case 'en':
        tlSelect.foundation_.setSelectedIndex(0)
        break
      case 'de':
        tlSelect.foundation_.setSelectedIndex(1)
        break
      case 'es':
        tlSelect.foundation_.setSelectedIndex(2)
        break
      case 'fr':
        tlSelect.foundation_.setSelectedIndex(3)
        break
      case 'it':
        tlSelect.foundation_.setSelectedIndex(4)
        break
      case 'ja':
        tlSelect.foundation_.setSelectedIndex(5)
        break
      case 'ko':
        tlSelect.foundation_.setSelectedIndex(6)
        break
      case 'zh-TW':
        tlSelect.foundation_.setSelectedIndex(7)
        break
      default:
        tlSelect.foundation_.setSelectedIndex(0)
    }
    tlSelect.listen('MDCSelect:change', () => {
      this.props.setOddSetting('targetLang', tlSelect.value)
    })

    const dlSelect = new MDCSelect(this.refs.docLang)
    switch (this.props.docLang) {
      case 'en':
        dlSelect.foundation_.setSelectedIndex(0)
        break
      case 'de':
        dlSelect.foundation_.setSelectedIndex(1)
        break
      case 'es':
        dlSelect.foundation_.setSelectedIndex(2)
        break
      case 'fr':
        dlSelect.foundation_.setSelectedIndex(3)
        break
      case 'it':
        dlSelect.foundation_.setSelectedIndex(4)
        break
      case 'ja':
        dlSelect.foundation_.setSelectedIndex(5)
        break
      case 'ko':
        dlSelect.foundation_.setSelectedIndex(6)
        break
      case 'zh-TW':
        dlSelect.foundation_.setSelectedIndex(7)
        break
      default:
        dlSelect.foundation_.setSelectedIndex(0)
    }
    dlSelect.listen('MDCSelect:change', () => {
      this.props.setOddSetting('docLang', dlSelect.value)
      this.props.chooseNewDocLang(dlSelect.value, this.props.language)
    })
  }

  componentDidUpdate(prevProps) {
    // if the data is all loaded, apply changes to settings
    if (!this.props.isLoading) {
      this.props.applySettings()
    }
    // if a new language is required, trigger transformations
    if ((prevProps.oddLastUpdated < this.props.oddLastUpdated) && this.props.newDataForLanguage.length > 0) {
      this.props.getNewDocForLang(this.props.newDataForLanguage, this.props.docLang)
    }
  }

  render() {
    const i18n = _i18n(this.props.language, 'Settings')
    const langSelect = [
      <input key="a" type="hidden" name="enhanced-select"/>,
      <i key="b" className="mdc-select__dropdown-icon"/>,
      <div key="c" className="mdc-select__selected-text"/>,
      <div key="d" className="mdc-select__menu mdc-menu mdc-menu-surface">
        <ul className="mdc-list">
          <li className="mdc-list-item" data-value="en" tabIndex={0}>
            English
          </li>
          <li className="mdc-list-item" data-value="de" tabIndex={1}>
            Deutsch
          </li>
          <li className="mdc-list-item" data-value="es" tabIndex={2}>
            Español
          </li>
          <li className="mdc-list-item" data-value="fr" tabIndex={3}>
            Français
          </li>
          <li className="mdc-list-item" data-value="it" tabIndex={4}>
            Italiano
          </li>
          <li className="mdc-list-item" data-value="ja" tabIndex={5}>
            日本語
          </li>
          <li className="mdc-list-item" data-value="ko" tabIndex={6}>
            한국어
          </li>
          <li className="mdc-list-item" data-value="zh-TW" tabIndex={7}>
            中文
          </li>
        </ul>
      </div>,
      <div key="e" className="mdc-line-ripple"/>
    ]
    const loading = !this.props.isLoading ? null : (<figure>
      <div role="progressbar" className="mdc-linear-progress mdc-linear-progress--indeterminate">
        <div className="mdc-linear-progress__buffering-dots"/>
        <div className="mdc-linear-progress__buffer"/>
        <div className="mdc-linear-progress__bar mdc-linear-progress__primary-bar">
          <span className="mdc-linear-progress__bar-inner"/>
        </div>
        <div className="mdc-linear-progress__bar mdc-linear-progress__secondary-bar">
          <span className="mdc-linear-progress__bar-inner"/>
        </div>
      </div>
      <figcaption>{this.props.loadingStatus}</figcaption>
    </figure>)
    const visible = this.props.settingsReady ? 'block' : 'none'
    return (
      <div style={{display: visible}}>
        {loading}
        <div className="mdc-layout-grid">
          <div className="mdc-layout-grid__inner romajs-formrow">
            <div className="mdc-layout-grid__cell--span-9"/>
            <div className="mdc-layout-grid__cell--span-3">
              <div style={{float: 'right'}}>
                <button className="mdc-button mdc-button--raised toggle"
                  disabled={this.props.isLoading}
                  onClick={() => this.props.goToMemberPage()}>
                  <i className="material-icons mdc-button__icon">arrow_forward</i> {i18n('Customize ODD')}
                </button>
              </div>
            </div>
          </div>
          <div className="mdc-layout-grid__inner romajs-formrow">
            <div className="mdc-layout-grid__cell--span-3">
              <label>{i18n('Title')}</label>
              <p className="mdc-text-field-helper-text mdc-text-field-helper-text--persistent"
                dangerouslySetInnerHTML={{__html: i18n('HelperText')}} />
            </div>
            <div className="mdc-layout-grid__cell--span-9">
              <div className="mdc-text-field mdc-text-field--upgraded mdc-text-field--fullwidth">
                <input autoFocus type="text" className="mdc-text-field__input" value={this.props.title}
                  onChange={(e) => this.props.setOddSetting('title', e.target.value)}/>
                <div className="mdc-text-field__bottom-line" style={{transformOrigin: '145px center'}}/>
              </div>
            </div>
          </div>
          <div className="mdc-layout-grid__inner romajs-formrow">
            <div className="mdc-layout-grid__cell--span-3">
              <label>{i18n('Identifier')}</label>
              <p className="mdc-text-field-helper-text mdc-text-field-helper-text--persistent"
                dangerouslySetInnerHTML={{__html: i18n('HelperTextIdentifier')}} />
            </div>
            <div className="mdc-layout-grid__cell--span-9">
              <div className="mdc-text-field mdc-text-field--upgraded mdc-text-field--fullwidth">
                <input autoFocus type="text" className="mdc-text-field__input" value={this.props.filename}
                  onChange={(e) => this.props.setOddSetting('filename', e.target.value)}/>
                <div className="mdc-text-field__bottom-line" style={{transformOrigin: '145px center'}}/>
              </div>
            </div>
          </div>
          <div className="mdc-layout-grid__inner romajs-formrow">
            <div className="mdc-layout-grid__cell--span-3">
              <label>{i18n('Customization Namespace')}</label>
              <p className="mdc-text-field-helper-text mdc-text-field-helper-text--persistent"
                dangerouslySetInnerHTML={{__html: i18n('HelperTextCustomNamespace')}} />
            </div>
            <div className="mdc-layout-grid__cell--span-9">
              <div className="mdc-text-field mdc-text-field--upgraded mdc-text-field--fullwidth">
                <input autoFocus type="text" className="mdc-text-field__input" value={this.props.namespace}
                  onChange={(e) => this.props.setOddSetting('namespace', e.target.value)}/>
                <div className="mdc-text-field__bottom-line" style={{transformOrigin: '145px center'}}/>
              </div>
              <div className="mdc-form-field">
                <div className="mdc-checkbox mdc-checkbox--upgraded mdc-ripple-upgraded mdc-ripple-upgraded--unbounded">
                  <input id="atts" type="checkbox" className="mdc-checkbox__native-control" checked={this.props.nsToAtts}
                    onChange={(e) => this.props.setOddSetting('nsToAtts', e.target.checked)}/>
                  <div className="mdc-checkbox__background">
                    <svg className="mdc-checkbox__checkmark" viewBox="0 0 24 24">
                      <path className="mdc-checkbox__checkmark-path" fill="none" stroke="white" d="M1.73,12.91 8.1,19.28 22.79,4.59"/>
                    </svg>
                    <div className="mdc-checkbox__mixedmark"/>
                  </div>
                </div>
                <label htmlFor="atts">{i18n('Apply to new attributes as well.')}</label>
              </div>
            </div>
          </div>
          <div className="mdc-layout-grid__inner romajs-formrow">
            <div className="mdc-layout-grid__cell--span-3">
              <label>{i18n('Prefix')}</label>
              <p className="mdc-text-field-helper-text mdc-text-field-helper-text--persistent"
                dangerouslySetInnerHTML={{__html: i18n('HelperTextPrefix')}} />
            </div>
            <div className="mdc-layout-grid__cell--span-9">
              <div className="mdc-text-field mdc-text-field--upgraded mdc-text-field--fullwidth">
                <input autoFocus type="text" className="mdc-text-field__input" value={this.props.prefix}
                  onChange={(e) => this.props.setOddSetting('prefix', e.target.value)}/>
                <div className="mdc-text-field__bottom-line" style={{transformOrigin: '145px center'}}/>
              </div>
            </div>
          </div>
          <div className="mdc-layout-grid__inner romajs-formrow">
            <div className="mdc-layout-grid__cell--span-3">
              <label>{i18n('Language of elements and attributes')}</label>
              <p className="mdc-text-field-helper-text mdc-text-field-helper-text--persistent"
                dangerouslySetInnerHTML={{__html: i18n('HelperTextLang')}} />
            </div>
            <div className="mdc-layout-grid__cell--span-9">
              <div className="mdc-select" ref="targetLang">
                {langSelect}
              </div>
            </div>
          </div>
          <div className="mdc-layout-grid__inner romajs-formrow">
            <div className="mdc-layout-grid__cell--span-3">
              <label>{i18n('Documentation Language')}</label>
              <p className="mdc-text-field-helper-text mdc-text-field-helper-text--persistent"
                dangerouslySetInnerHTML={{__html: i18n('HelperTextDocLang')}} />
            </div>
            <div className="mdc-layout-grid__cell--span-9">
              <div className="mdc-select" ref="docLang">
                {langSelect}
              </div>
            </div>
          </div>
          <div className="mdc-layout-grid__inner romajs-formrow">
            <div className="mdc-layout-grid__cell--span-3">
              <label>{i18n('Author')}</label>
              <p className="mdc-text-field-helper-text mdc-text-field-helper-text--persistent"
                dangerouslySetInnerHTML={{__html: i18n('HelperTextAuthor')}} />
            </div>
            <div className="mdc-layout-grid__cell--span-9">
              <div className="mdc-text-field mdc-text-field--upgraded mdc-text-field--fullwidth">
                <input autoFocus type="text" className="mdc-text-field__input" value={this.props.author}
                  onChange={(e) => this.props.setOddSetting('author', e.target.value)}/>
                <div className="mdc-text-field__bottom-line" style={{transformOrigin: '145px center'}}/>
              </div>
            </div>
          </div>
        </div>
      </div>)
  }
}

Settings.propTypes = {
  title: PropTypes.string.isRequired,
  filename: PropTypes.string.isRequired,
  namespace: PropTypes.string.isRequired,
  nsToAtts: PropTypes.bool.isRequired,
  prefix: PropTypes.string.isRequired,
  targetLang: PropTypes.string.isRequired,
  docLang: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
  loadingStatus: PropTypes.string,
  settingsReady: PropTypes.bool.isRequired,
  goToMemberPage: PropTypes.func.isRequired,
  setOddSetting: PropTypes.func.isRequired,
  applySettings: PropTypes.func.isRequired,
  oddLastUpdated: PropTypes.number.isRequired,
  newDataForLanguage: PropTypes.string,
  chooseNewDocLang: PropTypes.func.isRequired,
  getNewDocForLang: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired
}
