import React from 'react'
import PropTypes from 'prop-types'
import { Component } from 'react'
import { _i18n } from '../localization/i18n'

import {MDCTabBar} from '@material/tabs'
import { MDCSelect } from '@material/select'

import { TEI_VERSIONS, TEI_CURRENT, getTEISchemaBaseURL,
  MEI_VERSIONS, MEI_CURRENT, getMEISchemaBaseURL
} from '../utils/versions'

export default class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      panel: 0,
      selectedFile: undefined,
      selectedKnown: undefined,
      localSource: undefined,
      format: undefined,
      version: undefined,
      odds: [
        {
          label: 'TEI All (customize by reducing TEI)',
          url: `tei_all.odd`,
          format: 'TEI'
        },
        {
          label: 'TEI Minimal (customize by building TEI up)',
          url: `tei_minimal.odd`,
          format: 'TEI'
        },
        {
          label: 'TEI Absolutely Bare',
          url: `tei_bare.odd`,
          format: 'TEI'
        },
        {
          label: 'TEI SimplePrint',
          url: `tei_simplePrint.odd`,
          format: 'TEI'
        },
        {
          label: 'TEI Lite',
          url: `tei_lite.odd`,
          format: 'TEI'
        },
        {
          label: 'TEI Tite',
          url: `tei_tite.odd`,
          format: 'TEI'
        },
        {
          label: 'TEI for Linguistic Corpora',
          url: `tei_corpus.odd`,
          format: 'TEI'
        },
        {
          label: 'TEI for Manuscript Description',
          url: `tei_ms.odd`,
          format: 'TEI'
        },
        {
          label: 'TEI with Drama',
          url: `tei_drama.odd`,
          format: 'TEI'
        },
        {
          label: 'TEI for Speech Representation',
          url: `tei_speech.odd`,
          format: 'TEI'
        },
        {
          label: 'TEI for Authoring ODDs',
          url: `tei_odds.odd`,
          format: 'TEI'
        },
        // {
        //   label: 'TEI with SVG',
        //   url: `tei_svg.odd`,
        //  format: 'TEI'
        // },
        // {
        //   label: 'TEI with MathML',
        //   url: `tei_math.odd`,
        //   format: 'TEI'
        // },
        // {
        //   label: 'TEI with XInclude',
        //   url: `tei_xinclude.odd`,
        //   format: 'TEI'
        // },
        {
          label: 'TEI for Journal of the TEI',
          url: `tei_jtei.odd`,
          format: 'TEI'
        },
        {
          label: 'MEI - All',
          url: `mei-all.xml`,
          format: 'MEI'
        },
        {
          label: 'MEI - All (Any Start)',
          url: `mei-all_anyStart.xml`,
          format: 'MEI'
        },
        {
          label: 'MEI - Common Music Notation',
          url: `mei-CMN.xml`,
          format: 'MEI'
        },
        {
          label: 'MEI - Mensural',
          url: `mei-Mensural.xml`,
          format: 'MEI'
        },
        {
          label: 'MEI - Neumes',
          url: `mei-Neumes.xml`,
          format: 'MEI'
        },
        {
          label: 'MEI - Basic',
          url: `mei-basic.xml`,
          format: 'MEI'
        }
      ]
    }
    this.updatePanel = this.updatePanel.bind(this)
    this.selectVersion = null
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
    this.setState({selectedKnown: this.state.odds[0].url, format: this.state.odds[0].format},
      this._updateCustomizationUrl
    )

    const select = new MDCSelect(this.refs.chooseodd)
    select.foundation_.setSelectedIndex(0)
    select.listen('MDCSelect:change', () => {
      const odd = this.state.odds.filter(o => o.label === select.value)[0]
      if (odd) {
        this.setState({selectedKnown: odd.url, format: odd.format, localSource: odd.localSource || undefined},
          this._updateCustomizationUrl
        )
      }
    })

    this.selectVersion = new MDCSelect(this.refs.chooseversion)
    this.selectVersion.foundation_.setSelectedIndex(0)
    this.selectVersion.listen('MDCSelect:change', () => {
      this.setState({version: this.selectVersion.value},
        this._updateCustomizationUrl
      )
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.format && prevState.format !== this.state.format) {
      this.selectVersion.foundation_.setValue(this.state.format === 'TEI' ? TEI_CURRENT : MEI_CURRENT)
      this._updateCustomizationUrl()
    }
  }

  updatePanel(index) {
    if (index === 0) {
      this._updateCustomizationUrl()
    } else {
      this.setState({start: () => this.props.uploadCustomization(this.state.selectedFile, this.props.language, this.state.localSource)})
    }
    this.setState({panel: index})
  }

  _updateCustomizationUrl() {
    const baseUrl = this.state.format === 'MEI' ? getMEISchemaBaseURL(this.state.version || MEI_CURRENT) : getTEISchemaBaseURL(this.state.version || TEI_CURRENT)
    const localSource = this.state.format === 'MEI' ? getMEISchemaBaseURL(this.state.version || MEI_CURRENT, true) : undefined
    const selectedKnown = `${baseUrl}${this.state.selectedKnown}`
    this.setState(
      {start: () => {this.props.getCustomization(selectedKnown, this.props.language, localSource)}}
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
        <div>
          <div className="romajs-hero">
            <div className="romajs-homebox mdc-card mdc-elevation--z10">
              <section className="mdc-card__primary">
                <nav id="basic-tab-bar" className="mdc-tab-bar" ref="tabs">
                  <a className="mdc-tab mdc-tab--active" tabIndex={0}>{i18n('Select ODD')}</a>
                  <a className="mdc-tab" tabIndex={0}>{i18n('Upload ODD')}</a>
                  <span className="mdc-tab-bar__indicator" style={{transform: 'translateX(160px) scale(0.333333, 1)', visibility: 'visible'}}/>
                </nav>
                <div className="romajs-tabPanels">
                  <div className="romajs-tabPanel" role="tabpanel" style={this._setActivePanel(0)}>
                    <h2 className="mdc-typography--title">{i18n('Select ODD')}</h2>
                    <div className="mdc-select" ref="chooseodd" style={{width: '65%'}}>
                      <input type="hidden" name="enhanced-select"/>
                      <i className="mdc-select__dropdown-icon"/>
                      <div className="mdc-select__selected-text"/>
                      <div className="mdc-select__menu mdc-menu mdc-menu-surface">
                        <ul className="mdc-list">{
                          this.state.odds.map((odd, i) => {
                            return (<li className="mdc-list-item" data-value={odd.label} key={`l${i}`} tabIndex={i}>{
                              i18n(odd.label)
                            }</li>)
                          })
                        }</ul>
                      </div>
                      <span className="mdc-floating-label">{i18n('Choose a preset')}</span>
                      <div className="mdc-line-ripple"/>
                    </div>
                    <div className="mdc-select" ref="chooseversion" style={{width: '25%', marginLeft: '5%'}}>
                      <input type="hidden" name="enhanced-select"/>
                      <i className="mdc-select__dropdown-icon"/>
                      <div className="mdc-select__selected-text"/>
                      <div className="mdc-select__menu mdc-menu mdc-menu-surface">
                        <ul className="mdc-list">
                          <li className="mdc-list-item" data-value={this.state.format === 'TEI' ? TEI_CURRENT : MEI_CURRENT}>current ({this.state.format === 'TEI' || this.state.format === undefined ? TEI_VERSIONS[0] : MEI_CURRENT})</li>
                          {
                            (this.state.format === 'TEI' ? TEI_VERSIONS : MEI_VERSIONS).map((v, i) => {
                              if (i === 0) { return '' } // skip current version
                              return <li className="mdc-list-item" data-value={v} key={`lv${i}`} tabIndex={i}>{v}</li>
                            })
                          }
                        </ul>
                      </div>
                      <span className="mdc-floating-label">Version</span>
                      <div className="mdc-line-ripple"/>
                    </div>
                  </div>
                  <div className="romajs-tabPanel" role="tabpanel" style={this._setActivePanel(1)}>
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
          <div className="romajs-homeText-container">
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
                  <li><span className="mdc-list-item__text">Bryan Wang</span></li>
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
