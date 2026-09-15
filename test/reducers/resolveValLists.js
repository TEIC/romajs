import expect from 'expect'
import fs from 'fs'
import romajsApp from './combinedReducers'

const localsource = fs.readFileSync('test/fakeData/p5subset.json', 'utf-8')

// <valItem> in a customization ODD carries @mode, but the ODD-to-JSON conversion drops it:
// every valItem comes back looking like a live value. These fixtures reproduce that.
const oddWith = (valList) => `<?xml version="1.0" encoding="UTF-8"?>
<TEI xmlns="http://www.tei-c.org/ns/1.0">
  <teiHeader><fileDesc><titleStmt><title>t</title><author>a</author></titleStmt>
  <publicationStmt><p>p</p></publicationStmt><sourceDesc><p>s</p></sourceDesc></fileDesc></teiHeader>
  <text><body><p>test</p><schemaSpec ident="test" start="TEI" prefix="tei_">
    <moduleRef key="tei"/><moduleRef key="core"/>
    <elementSpec ident="milestone" mode="change">
      <attList><attDef ident="unit" mode="change">${valList}</attDef></attList>
    </elementSpec>
  </schemaSpec></body></text>
</TEI>`

const customizationJson = (valItemIdents) => ({
  elements: [{
    ident: 'milestone',
    classes: {model: ['model.milestoneLike'], atts: ['att.global', 'att.milestoneUnit'], unknown: []},
    attributes: [{
      ident: 'unit',
      mode: 'change',
      onElement: true,
      datatype: {},
      valList: {type: '', valItem: valItemIdents.map(i => ({ident: i, desc: [], shortDesc: '', gloss: [], altIdent: []}))}
    }]
  }],
  classes: {models: [], attributes: []}
})

const load = (json, xml) => romajsApp({
  odd: {
    customization: { isFetching: false, json, xml },
    localsource: { isFetching: true }
  },
  selectedOdd: ''
}, {
  type: 'RECEIVE_LOCAL_SOURCE',
  json: JSON.parse(localsource),
  receivedAt: Date.now()
})

const unitValList = (state) => state.odd.customization.json.elements
  .filter(e => e.ident === 'milestone')[0].attributes
  .filter(a => a.ident === 'unit')[0].valList

describe('Value lists of an imported customization', () => {
  it('should drop values the customization deletes', () => {
    // As written by RomaJS: every inherited value deleted, one new value added.
    const deleted = ['page', 'column', 'line', 'book', 'poem', 'canto', 'speaker',
      'stanza', 'act', 'scene', 'section', 'absent', 'unnumbered']
    const xml = oddWith(`<valList mode="change">
      <valItem mode="add" ident="volume"><desc versionDate="2026-09-15" xml:lang="en">test</desc></valItem>
      ${deleted.map(i => `<valItem mode="delete" ident="${i}"/>`).join('')}
    </valList>`)
    const state = load(customizationJson(['volume', ...deleted]), xml)
    expect(unitValList(state).valItem.map(v => v.ident)).toEqual(['volume'])
  })

  it('should keep the values a partial deletion leaves behind', () => {
    const xml = oddWith('<valList mode="change"><valItem mode="delete" ident="page"/></valList>')
    const state = load(customizationJson(['page']), xml)
    const idents = unitValList(state).valItem.map(v => v.ident)
    expect(idents).toNotContain('page')
    expect(idents).toContain('column')
    expect(idents.length).toEqual(12)
  })

  it('should inherit the list type when the customization does not change it', () => {
    const xml = oddWith('<valList mode="change"><valItem mode="delete" ident="page"/></valList>')
    const state = load(customizationJson(['page']), xml)
    expect(unitValList(state).type).toEqual('semi')
  })

  it('should keep a customization\'s own version of a redefined value', () => {
    const xml = oddWith(`<valList mode="change">
      <valItem mode="change" ident="column"><desc xml:lang="en">a new desc</desc></valItem>
      <valItem mode="delete" ident="page"/>
    </valList>`)
    const json = customizationJson(['column', 'page'])
    json.elements[0].attributes[0].valList.valItem[0].shortDesc = 'a new desc'
    const state = load(json, xml)
    expect(unitValList(state).valItem.filter(v => v.ident === 'column')[0].shortDesc).toEqual('a new desc')
  })

  it('should leave an absolute value list alone', () => {
    // No @mode on <valList>: the list replaces the inherited one as is.
    const xml = oddWith('<valList><valItem ident="page"/></valList>')
    const state = load(customizationJson(['page']), xml)
    expect(unitValList(state).valItem.map(v => v.ident)).toEqual(['page'])
  })

  it('should re-export the customization\'s deletions after a further edit', () => {
    // The whole point of rebuilding the list: the values the customization deletes must
    // still be deleted in the ODD once the user edits the same attribute.
    const xml = oddWith('<valList mode="change"><valItem mode="delete" ident="page"/></valList>')
    const json = customizationJson(['page'])
    json.modules = []
    json.datatypes = []
    const loaded = load(json, xml)
    const edited = romajsApp(loaded, {
      type: 'ADD_VALITEM', member: 'milestone', memberType: 'element', attr: 'unit', value: 'volume'
    })
    const exported = romajsApp(edited, {type: 'UPDATE_CUSTOMIZATION_ODD'})
    const attDef = /<attDef ident="unit"[\s\S]*?<\/attDef>/.exec(exported.odd.customization.updatedXml)[0]
    expect(attDef).toInclude('<valItem mode="delete" ident="page"')
    expect(attDef).toInclude('ident="volume"')
    // The values the customization keeps are inherited, so they must not be restated.
    expect(attDef).toExclude('ident="column"')
  })

  it('should not touch the customization until the localsource is in', () => {
    const xml = oddWith('<valList mode="change"><valItem mode="delete" ident="page"/></valList>')
    const state = romajsApp({
      odd: {customization: {isFetching: false, xml}, localsource: {isFetching: true}},
      selectedOdd: ''
    }, {
      type: 'RECEIVE_ODD_JSON',
      json: customizationJson(['page']),
      receivedAt: Date.now()
    })
    expect(unitValList(state).valItem.map(v => v.ident)).toEqual(['page'])
  })
})
