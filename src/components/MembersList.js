import React from 'react'
import PropTypes from 'prop-types'
import { Component } from 'react'
import FilterSearch from '../containers/FilterSearch'
import Member from './Member'
import MembersFacet from './MemberFacet'

export default class MembersList extends Component {
  constructor(props) {
    super(props)
    this.state = { windowWidth: 0 }
  }

  componentWillMount() {
    this.udpatedWidth()
  }

  componentDidMount() {
    window.addEventListener('resize', () => {this.udpatedWidth()})
  }

  componentWillUnmount() {
    this.props.clearUiData()
    window.removeEventListener('resize', this.udpatedWidth)
  }

  udpatedWidth() {
    // Set max width to document size
    const cw = document.documentElement.clientWidth
    this.setState({
      windowWidth: cw
    })
  }

  render() {
    let content = (
      <figure>
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
    if (this.props.members.length > 0) {
      content = [<div key="toolbar" className="mdc-toolbar--fixed mdc-toolbar__row romajs-toolbar2">
        <section className="mdc-toolbar__section mdc-toolbar__section--align-start">
          <MembersFacet setMemberTypeVisibility={this.props.setMemberTypeVisibility}
            visibleMemberTypes={this.props.visibleMemberTypes} type="elements" label="Elements" />
          <MembersFacet setMemberTypeVisibility={this.props.setMemberTypeVisibility}
            visibleMemberTypes={this.props.visibleMemberTypes} type="attclasses" label="Attribute Classes" />
        </section>
        <section className="mdc-toolbar__section mdc-toolbar__section--align-end">
          <FilterSearch/>
        </section>
      </div>,
      <main key="main" style={{maxWidth: this.state.windowWidth}}>
        <ul key="list" className="mdc-list mdc-list--two-line romajs-itemlist">
          {this.props.members.map(element => {
            if (element.visible) {
              return (<Member
                key={element.ident}
                {...element}
                toggleItem={this.props.toggleItem}
              />)
            }
            return ''
          }
          )}
        </ul>
      </main>]
    }
    return content
  }
}

MembersList.propTypes = {
  members: PropTypes.arrayOf(PropTypes.shape({
    selected: PropTypes.bool.isRequired,
    visible: PropTypes.bool.isRequired,
    ident: PropTypes.string.isRequired,
    shortDesc: PropTypes.string.isRequired,
    desc: PropTypes.array.isRequired,
    module: PropTypes.string.isRequired,
    module_selected: PropTypes.bool.isRequired
  }).isRequired).isRequired,
  toggleItem: PropTypes.func.isRequired,
  loadingStatus: PropTypes.string,
  clearUiData: PropTypes.func.isRequired,
  setMemberTypeVisibility: PropTypes.func,
  visibleMemberTypes: PropTypes.array
}
