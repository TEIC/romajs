import React from 'react'
import PropTypes from 'prop-types'
import { Component } from 'react'
import { _i18n } from '../localization/i18n'
import presets from '../utils/presets'

import {MDCTabBar} from '@material/tabs'
import { MDCSelect } from '@material/select'

export default class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      panel: 0,
      selectedFile: undefined,
      selectedKnown: undefined,
      odds: {
        labels: [
          'TEI All (customize by reducing TEI)',
          'TEI Minimal (customize by building TEI up)',
          'TEI Absolutely Bare',
          'TEI SimplePrint',
          'TEI Lite',
          'TEI Tite',
          'TEI for Linguistic Corpora',
          'TEI for Manuscript Description',
          'TEI with Drama',
          'TEI for Speech Representation',
          'TEI for Authoring ODDs',
          // 'TEI with SVG',
          // 'TEI with MathML',
          // 'TEI with XInclude',
          'TEI for Journal of the TEI'
        ],
        urls: [
          `${presets}/tei_all.odd`,
          `${presets}/tei_minimal.odd`,
          `${presets}/tei_bare.odd`,
          `${presets}/tei_simplePrint.odd`,
          `${presets}/tei_lite.odd`,
          `${presets}/tei_tite.odd`,
          `${presets}/tei_corpus.odd`,
          `${presets}/tei_ms.odd`,
          `${presets}/tei_drama.odd`,
          `${presets}/tei_speech.odd`,
          `${presets}/tei_odds.odd`,
          // `${presets}/tei_svg.odd`,
          // `${presets}/tei_math.odd`,
          // `${presets}/tei_xinclude.odd`,
          `${presets}/tei_jtei.odd`
        ]
      }
    }
    this.updatePanel = this.updatePanel.bind(this)
  }

  componentDidMount() {
    console.log(` 
                    _____      ___      _____
                    (   )     @   @     \\%%%/
                     |||       |||      \\%%%/
                     |||       |||       |||
                     |||       |||       |||
                     |||       |||       |||
                    (___)     (___)     (___)
                              Roma
   If you're checking out the console, maybe you want to contribute?
              Please do! https://github.com/TEIC/romajs
   `)

    this.props.clearUiData()
    const tabBar = new MDCTabBar(this.refs.tabs)
    tabBar.listen('MDCTabBar:change', ({detail: tabs}) => {
      this.updatePanel(tabs.activeTabIndex)
    })
    // Set start function to first option
    this.setState({selectedKnown: this.state.odds.urls[0]})
    this._updateCustomizationUrl()

    const select = new MDCSelect(this.refs.chooseodd)
    select.foundation_.setSelectedIndex(0)
    select.listen('MDCSelect:change', () => {
      const idx = this.state.odds.labels.indexOf(select.value)
      this.setState({selectedKnown: this.state.odds.urls[idx]})
      this._updateCustomizationUrl()
    })
  }

  updatePanel(index) {
    if (index === 0) {
      this._updateCustomizationUrl()
    } else {
      this.setState({start: () => this.props.uploadCustomization(this.state.selectedFile, this.props.language)})
    }
    this.setState({panel: index})
  }

  _updateCustomizationUrl() {
    this.setState(
      {start: () => {this.props.getCustomization(this.state.selectedKnown, this.props.language)}}
    )
  }

  _setActivePanel(index) {
    if (index === this.state.panel) {
      return {display: 'block'}
    }
    return {display: 'none'}
  }

  render() {
    // Set language function
    const i18n = _i18n(this.props.language, 'Home')
    let disabled = null
    if (this.state.panel === 1 && !this.state.selectedFile) {
      disabled = {disabled: 'disabled'}
    }
    return (
      <main>
        <div className="romajs-hero">
          <div className="mdc-layout-grid">
            <div className="mdc-layout-grid__inner">
              <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-6">
                <div className="romajs-homebox mdc-card mdc-elevation--z10">
                  <section className="mdc-card__primary">
                    <nav id="basic-tab-bar" className="mdc-tab-bar" ref="tabs">
                      <a className="mdc-tab mdc-tab--active">{i18n('Select ODD')}</a>
                      <a className="mdc-tab">{i18n('Upload ODD')}</a>
                      <span className="mdc-tab-bar__indicator" style={{transform: 'translateX(160px) scale(0.333333, 1)', visibility: 'visible'}}/>
                    </nav>
                    <div className="romajs-tabPanels">
                      <div className="romajs-tabPanel" role="tabpanel" style={this._setActivePanel(0)}>
                        <h2 className="mdc-typography--title">{i18n('Select ODD')}</h2>
                        <div className="mdc-select" ref="chooseodd">
                          <input type="hidden" name="enhanced-select"/>
                          <i className="mdc-select__dropdown-icon"/>
                          <div className="mdc-select__selected-text"/>
                          <div className="mdc-select__menu mdc-menu mdc-menu-surface">
                            <ul className="mdc-list">{
                              this.state.odds.urls.map((url, i) => {
                                return (<li className="mdc-list-item" data-value={this.state.odds.labels[i]} key={i} tabIndex={i}>{
                                  i18n(this.state.odds.labels[i])
                                }</li>)
                              })
                            }</ul>
                          </div>
                          <span className="mdc-floating-label">{i18n('Choose a preset')}</span>
                          <div className="mdc-line-ripple"/>
                        </div>
                      </div>
                      <div className="romajs-tabPanel"role="tabpanel" style={this._setActivePanel(1)}>
                        <h2 className="mdc-typography--title">{i18n('Upload ODD')}</h2>
                        <input type="file" id="files" accept=".xml,.tei,.odd" onChange={e => {
                          this.setState({selectedFile: e.target.files.length > 0 ? e.target.files : undefined})
                        }}/>
                      </div>
                    </div>
                  </section>
                  <section className="mdc-card__actions">
                    <button className="mdc-button mdc-button--compact mdc-card__action" onClick={this.state.start} {...disabled}>{i18n('Start')}</button>
                    <button className="mdc-button mdc-button--compact mdc-card__action" id="test"
                      onClick={this.props.loadTestData} {...disabled} style={{display: 'none'}}>(Test: Skip TEIGarage)</button>
                  </section>
                </div>
              </div>
              <div className="mdc-layout-grid__cell mdc-layout-grid__cell--span-6" style={{backgroundColor: '#d9d9d9'}}>
                <div className="romajs-homeText">
                  <div>
                    <h2 className="mdc-typography--headline3">Roma</h2>
                    <p className="mdc-typography--body1" dangerouslySetInnerHTML={{__html: i18n('intro')}} />
                    <p className="mdc-typography--body1" dangerouslySetInnerHTML={{__html: i18n('antiqua')}} />
                  </div>
                  <div>
                    <h2 className="mdc-typography--headline4">{i18n('What it is supposed to do')}</h2>
                    <p className="mdc-typography--body1" dangerouslySetInnerHTML={{__html: i18n('does')}} />
                  </div>
                  <div>
                    <h2 className="mdc-typography--headline4">{i18n('What it does not do')}</h2>
                    <p className="mdc-typography--body1" dangerouslySetInnerHTML={{__html: i18n('doesnot')}} />
                  </div>
                  <div>
                    <h2 className="mdc-typography--headline4">{i18n('Known issues')}</h2>
                    <ul className="mdc-typography--body1" dangerouslySetInnerHTML={{__html: i18n('known')}}/>
                  </div>
                  <div>
                    <h2 className="mdc-typography--headline4">{i18n('Contribute')}</h2>
                    <p className="mdc-typography--body1" dangerouslySetInnerHTML={{__html: i18n('contrib')}} />
                  </div>
                  <div>
                    <h2 className="mdc-typography--headline4">{i18n('Contributors')}</h2>
                    <h3 className="mdc-typography--headline5">{i18n('Development')}</h3>
                    <ul className="mdc-list">
                      <li><span className="mdc-list-item__text">Raff Viglianti (lead)</span></li>
                      <li><span className="mdc-list-item__text">Peter Stadler</span></li>
                    </ul>
                    <h3 className="mdc-typography--headline5">{i18n('Localization')}</h3>
                    <ul className="mdc-list">
                      <li className="romajs-credits"><span className="mdc-list-item__graphic" aria-hidden="true">ES</span>Gimena del Rio Riande</li>
                      <li className="romajs-credits"><span className="mdc-list-item__graphic" aria-hidden="true">JA</span>Jun Ogawa, Center for Open Data in the Humanities / CODH</li>
                      <li className="romajs-credits"><span className="mdc-list-item__graphic" aria-hidden="true">JA</span>Kiyonori Nagasaki, International Institute for Digital Humanities</li>
                      <li className="romajs-credits"><span className="mdc-list-item__graphic" aria-hidden="true">FR</span>Lou Burnard</li>
                      <li className="romajs-credits"><span className="mdc-list-item__graphic" aria-hidden="true">JA</span><span>Natsuko Nakagawa, National Institute for Japanese Language and Linguistics</span></li>
                      <li className="romajs-credits"><span className="mdc-list-item__graphic" aria-hidden="true">JA</span>Shintaro Seki, Graduate School of Humanities and Sociology, The University of Tokyo</li>
                      <li className="romajs-credits"><span className="mdc-list-item__graphic" aria-hidden="true">JA</span>So Miyagawa, National Institute for Japanese Language and Linguistics</li>
                      <li className="romajs-credits"><span className="mdc-list-item__graphic" aria-hidden="true">IT</span>Raff Viglianti</li>
                      <li className="romajs-credits"><span className="mdc-list-item__graphic" aria-hidden="true">JA</span>Yuna Murata, National Diet Library</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }
}

Home.propTypes = {
  uploadCustomization: PropTypes.func,
  getCustomization: PropTypes.func,
  clearUiData: PropTypes.func,
  loadTestData: PropTypes.func,
  language: PropTypes.string.isRequired
}
