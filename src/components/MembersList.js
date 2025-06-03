import React from 'react'
import PropTypes from 'prop-types'
import { Component } from 'react'
import FilterSearch from '../containers/FilterSearch'
import Member from './Member'
import MembersFacet from './MemberFacet'
import AddMemberFab from './AddMemberFab'
import { _i18n } from '../localization/i18n'

export default class MembersList extends Component {
  constructor(props) {
    super(props)
    this.state = { windowWidth: 0 }
  }

  componentWillMount() {
    this.udpatedWidth()
  }

  componentDidMount() {
    this.props.clearUiData()
    window.addEventListener('resize', () => {this.udpatedWidth()})
  }

  componentWillUnmount() {
    this.props.clearUiData()
    window.removeEventListener('resize', this.udpatedWidth)
  }

  udpatedWidth() {
    // Set max width to document size
    const cw = document.documentElement.clientWidth
    // this small adjustment avoids unwanted horizontal scrollbar
    const windowWidth = cw - cw * 0.001
    this.setState({
      windowWidth
    })
  }

  render() {
    // Set language function
    const i18n = _i18n(this.props.language, 'MembersList')
    let members = <h2 className="mdc-typography--headline5" style={{margin: '2em 0px 0px 40px'}}>{i18n('No items found. Try searching for something else.')}</h2>
    if (this.props.members.length > 0) {
      members = (<ul key="list" className="mdc-list mdc-list--two-line romajs-itemlist">
        {this.props.members.map(member => {
          return (<Member
            key={member.ident}
            {...member}
            toggleItem={this.props.toggleItem}
          />)
        }
        )}
      </ul>)
    }
    const newSort = this.props.sortBy === 'element' ? 'module' : 'element'
    const newSortLabel = this.props.sortBy === 'element' ? i18n('by module') : i18n('alphabetically')
    return [<div key="toolbar" className="mdc-toolbar--fixed mdc-toolbar__row romajs-toolbar2">
      <section className="mdc-toolbar__section mdc-toolbar__section--align-start">
        <div className="mdc-chip-set mdc-chip-set--filter">
          <MembersFacet setMemberTypeVisibility={this.props.setMemberTypeVisibility}
            visibleMemberTypes={this.props.visibleMemberTypes} type="elements" label={i18n('Elements')} />
          <MembersFacet setMemberTypeVisibility={this.props.setMemberTypeVisibility}
            visibleMemberTypes={this.props.visibleMemberTypes} type="attclasses" label={i18n('Attribute Classes')} />
          <MembersFacet setMemberTypeVisibility={this.props.setMemberTypeVisibility}
            visibleMemberTypes={this.props.visibleMemberTypes} type="modelclasses" label={i18n('Model Classes')} />
          <MembersFacet setMemberTypeVisibility={this.props.setMemberTypeVisibility}
            visibleMemberTypes={this.props.visibleMemberTypes} type="datatypes" label={i18n('Datatypes')} />
        </div>
      </section>
      <section className="mdc-toolbar__section mdc-toolbar__section--align-end">
        <div className={`mdc-chip mdc-ripple-upgraded romajs-focusablechip`} tabIndex={0}
          onClick={() => this.props.sortMembersBy(newSort)}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && this.props.sortMembersBy(newSort)}>
          <i className="material-icons mdc-chip__icon mdc-chip__icon--leading">swap_vert</i>
          <div className="mdc-chip__text">{newSortLabel}</div>
        </div>
        <FilterSearch/>
      </section>
    </div>,
    <main key="main" style={{maxWidth: this.state.windowWidth}}>
      <AddMemberFab language={this.props.language}/>
      {members}
    </main>]
  }
}

MembersList.propTypes = {
  members: PropTypes.arrayOf(PropTypes.shape({
    selected: PropTypes.bool.isRequired,
    highlight: PropTypes.string,
    ident: PropTypes.string.isRequired,
    shortDesc: PropTypes.string.isRequired,
    desc: PropTypes.array.isRequired,
    module: PropTypes.string.isRequired,
    module_selected: PropTypes.bool.isRequired
  }).isRequired).isRequired,
  toggleItem: PropTypes.func.isRequired,
  clearUiData: PropTypes.func.isRequired,
  setMemberTypeVisibility: PropTypes.func,
  visibleMemberTypes: PropTypes.array,
  language: PropTypes.string.isRequired,
  sortBy: PropTypes.string.isRequired,
  sortMembersBy: PropTypes.func.isRequired
}
