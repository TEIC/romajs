import React from 'react'
import PropTypes from 'prop-types'
import { Component } from 'react'

import {MDCTabBar} from '@material/tabs'
import { MDCSelect } from '@material/select'

export default class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      panel: 0,
      selectedFile: undefined,
      odds: {
        labels: [
          'TEI Absolutely Bare',
          'TEI SimplePrint',
          'TEI Lite',
          'TEI Tite',
          'TEI for Linguistic Corpora',
          'TEI for Manuscript Description',
          'TEI with Drama',
          'TEI for Speech Representation',
          'TEI for Authoring ODDs',
          'TEI with SVG',
          'TEI with MathML',
          'TEI with XInclude',
          'TEI for Journal of the TEI'
        ],
        urls: [
          'http://www.tei-c.org/Vault/P5/current/xml/tei/custom/odd/tei_bare.odd',
          'http://www.tei-c.org/Vault/P5/current/xml/tei/custom/odd/tei_simplePrint.odd',
          'http://www.tei-c.org/Vault/P5/current/xml/tei/custom/odd/tei_lite.odd',
          'http://www.tei-c.org/Vault/P5/current/xml/tei/custom/odd/tei_tite.odd',
          'http://www.tei-c.org/Vault/P5/current/xml/tei/custom/odd/tei_corpus.odd',
          'http://www.tei-c.org/Vault/P5/current/xml/tei/custom/odd/tei_ms.odd',
          'http://www.tei-c.org/Vault/P5/current/xml/tei/custom/odd/tei_drama.odd',
          'http://www.tei-c.org/Vault/P5/current/xml/tei/custom/odd/tei_speech.odd',
          'http://www.tei-c.org/Vault/P5/current/xml/tei/custom/odd/tei_odds.odd',
          'http://www.tei-c.org/Vault/P5/current/xml/tei/custom/odd/tei_svg.odd',
          'http://www.tei-c.org/Vault/P5/current/xml/tei/custom/odd/tei_math.odd',
          'http://www.tei-c.org/Vault/P5/current/xml/tei/custom/odd/tei_xinclude.odd',
          'http://www.tei-c.org/Vault/P5/current/xml/tei/custom/odd/tei_jtei.odd'
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
                             Roma JS
   If you're checking out the console, maybe you want to contribute?
              Please do! https://github.com/raffazizzi/romajs
   `)

    this.props.clearUiData()
    const tabBar = new MDCTabBar(this.refs.tabs)
    tabBar.listen('MDCTabBar:change', ({detail: tabs}) => {
      this.updatePanel(tabs.activeTabIndex)
    })
    // Set start function to first option
    this._updateCustomizationUrl(this.state.odds.urls[0])

    const select = new MDCSelect(this.refs.chooseodd)
    select.foundation_.setSelectedIndex(0)
    select.listen('MDCSelect:change', () => {
      const idx = this.state.odds.labels.indexOf(select.value)
      this._updateCustomizationUrl(this.state.odds.urls[idx])
    })
  }

  updatePanel(index) {
    if (index === 0) {
      this.setState({start: this.props.getCustomization})
    } else {
      this.setState({start: () => this.props.uploadCustomization(this.state.selectedFile)})
    }
    this.setState({panel: index})
  }

  _updateCustomizationUrl(url) {
    this.setState(
      {start: () => {this.props.getCustomization(url)}}
    )
  }

  _setActivePanel(index) {
    if (index === this.state.panel) {
      return {display: 'block'}
    }
    return {display: 'none'}
  }

  render() {
    let disabled = null
    if (this.state.panel === 1 && !this.state.selectedFile) {
      disabled = {disabled: 'disabled'}
    }
    return (
      <main>
        <div className="romajs-hero">
          <div className="romajs-homebox mdc-card mdc-elevation--z10">
            <section className="mdc-card__primary">
              <nav id="basic-tab-bar" className="mdc-tab-bar" ref="tabs">
                <a className="mdc-tab mdc-tab--active">Select ODD</a>
                <a className="mdc-tab">Upload ODD</a>
                <span className="mdc-tab-bar__indicator" style={{transform: 'translateX(160px) scale(0.333333, 1)', visibility: 'visible'}}/>
              </nav>
              <div className="romajs-tabPanels">
                <div className="romajs-tabPanel" role="tabpanel" style={this._setActivePanel(0)}>
                  <h2 className="mdc-typography--title">Select ODD</h2>
                  <div className="mdc-select" role="listbox" ref="chooseodd">
                    <div className="mdc-select__surface" tabIndex="0">
                      <div className="mdc-select__label"/>
                      <div className="mdc-select__selected-text"/>
                      <div className="mdc-select__bottom-line"/>
                    </div>
                    <div className="mdc-menu mdc-select__menu">
                      <ul className="mdc-list mdc-menu__items">{
                        this.state.odds.urls.map((url, i) => {
                          return (<li className="mdc-list-item" role="option" key={i} tabIndex={i}>{this.state.odds.labels[i]}</li>)
                        })
                      }</ul>
                    </div>
                  </div>
                </div>
                <div className="romajs-tabPanel"role="tabpanel" style={this._setActivePanel(1)}>
                  <h2 className="mdc-typography--title">Upload ODD</h2>
                  <input type="file" id="files" accept=".xml,.tei,.odd" onChange={e => {
                    this.setState({selectedFile: e.target.files.length > 0 ? e.target.files : undefined})
                  }}/>
                </div>
              </div>
            </section>
            <section className="mdc-card__actions">
              <button className="mdc-button mdc-button--compact mdc-card__action" onClick={this.state.start} {...disabled}>Start</button>
              <button className="mdc-button mdc-button--compact mdc-card__action" id="test"
                onClick={this.props.loadTestData} {...disabled} style={{display: 'none'}}>(Test: Skip OxGarage)</button>
            </section>
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
  loadTestData: PropTypes.func
}
