import expect from 'expect'
import fs from 'fs'
import romajsApp from './combinedReducers'

const serializer = new XMLSerializer()
const parser = new DOMParser()

const customization = fs.readFileSync('test/fakeData/bare.json', 'utf-8')
const customizationXMLString = fs.readFileSync('test/fakeData/bare.odd', 'utf-8')
const localsource = fs.readFileSync('test/fakeData/p5subset.json', 'utf-8')
const customizationXML = parser.parseFromString(customizationXMLString)
let customJson = null
let localJson = null

serializer
customizationXML

describe('Update Customization Datatypes (handles UPDATE_CUSTOMIZATION_ODD)', () => {
  it('should change an attribute class\' documentation (desc, no previous change)', () => {
    customJson = JSON.parse(customization)
    localJson = JSON.parse(localsource)
    const firstState = romajsApp({
      odd: {
        customization: { isFetching: false, json: customJson, xml: customizationXMLString },
        localsource: { isFetching: false, json: localJson }
      },
      selectedOdd: ''
    }, {
      type: 'UPDATE_DATATYPE_DOCS',
      member: 'teidata.certainty',
      docEl: 'desc',
      content: '<desc xmlns="http://www.tei-c.org/ns/1.0" xml:lang="en">new desc</desc>',
      index: 0
    })
    const state = romajsApp(firstState, {
      type: 'UPDATE_CUSTOMIZATION_ODD'
    })
    let xml = parser.parseFromString(state.odd.customization.updatedXml)
    xml = global.uselocaldom(xml)
    expect(xml.querySelector('dataSpec[ident="teidata.certainty"] > desc').textContent).toEqual('new desc')
  })

  it('should change a dataRef', () => {
    customJson = JSON.parse(customization)
    localJson = JSON.parse(localsource)
    const firstState = romajsApp({
      odd: {
        customization: { isFetching: false, json: customJson, xml: customizationXMLString },
        localsource: { isFetching: false, json: localJson }
      },
      selectedOdd: ''
    }, {
      type: 'SET_DATAREF',
      datatype: 'teidata.count',
      keyOrName: 'anyURI',
      index: 0
    })
    const state = romajsApp(firstState, {
      type: 'UPDATE_CUSTOMIZATION_ODD'
    })
    let xml = parser.parseFromString(state.odd.customization.updatedXml)
    xml = global.uselocaldom(xml)
    expect(xml.querySelector('dataSpec[ident="teidata.count"] dataRef').getAttribute('name')).toEqual('anyURI')
  })

  it('should change a dataRef\'s restriction', () => {
    customJson = JSON.parse(customization)
    localJson = JSON.parse(localsource)
    const firstState = romajsApp({
      odd: {
        customization: { isFetching: false, json: customJson, xml: customizationXMLString },
        localsource: { isFetching: false, json: localJson }
      },
      selectedOdd: ''
    }, {
      type: 'SET_DATAREF_RESTRICTION',
      datatype: 'teidata.count',
      keyOrName: 'nonNegativeInteger',
      value: '[0-9]',
      index: 0
    })
    const state = romajsApp(firstState, {
      type: 'UPDATE_CUSTOMIZATION_ODD'
    })
    let xml = parser.parseFromString(state.odd.customization.updatedXml)
    xml = global.uselocaldom(xml)
    expect(xml.querySelector('dataSpec[ident="teidata.count"] dataRef').getAttribute('restriction')).toEqual('[0-9]')
  })

  it('should add a new dataRef', () => {
    customJson = JSON.parse(customization)
    localJson = JSON.parse(localsource)
    const firstState = romajsApp({
      odd: {
        customization: { isFetching: false, json: customJson, xml: customizationXMLString },
        localsource: { isFetching: false, json: localJson }
      },
      selectedOdd: ''
    }, {
      type: 'NEW_DATAREF',
      datatype: 'teidata.enumerated'
    })
    const secondState = romajsApp(firstState, {
      type: 'SET_DATAREF',
      datatype: 'teidata.enumerated',
      keyOrName: 'anyURI',
      index: 1
    })
    const state = romajsApp(secondState, {
      type: 'UPDATE_CUSTOMIZATION_ODD'
    })
    let xml = parser.parseFromString(state.odd.customization.updatedXml)
    xml = global.uselocaldom(xml)
    expect(xml.querySelectorAll('dataSpec[ident="teidata.enumerated"] dataRef')[1].getAttribute('name')).toEqual('anyURI')
  })

  it('should add a new textNode', () => {
    customJson = JSON.parse(customization)
    localJson = JSON.parse(localsource)
    const firstState = romajsApp({
      odd: {
        customization: { isFetching: false, json: customJson, xml: customizationXMLString },
        localsource: { isFetching: false, json: localJson }
      },
      selectedOdd: ''
    }, {
      type: 'NEW_TEXTNODE',
      datatype: 'teidata.enumerated'
    })
    const state = romajsApp(firstState, {
      type: 'UPDATE_CUSTOMIZATION_ODD'
    })
    let xml = parser.parseFromString(state.odd.customization.updatedXml)
    xml = global.uselocaldom(xml)
    expect(xml.querySelector('dataSpec[ident="teidata.enumerated"] textNode')).toExist()
  })

  it('should add a new valList and valItem', () => {
    customJson = JSON.parse(customization)
    localJson = JSON.parse(localsource)
    const firstState = romajsApp({
      odd: {
        customization: { isFetching: false, json: customJson, xml: customizationXMLString },
        localsource: { isFetching: false, json: localJson }
      },
      selectedOdd: ''
    }, {
      type: 'NEW_DATATYPE_VALLIST',
      datatype: 'teidata.enumerated'
    })
    const secondState = romajsApp(firstState, {
      type: 'ADD_DATATYPE_VALITEM',
      datatype: 'teidata.enumerated',
      index: 1,
      value: 'test'
    })
    const thirdState = romajsApp(secondState, {
      type: 'ADD_DATATYPE_VALITEM',
      datatype: 'teidata.enumerated',
      index: 1,
      value: 'test2'
    })
    const state = romajsApp(thirdState, {
      type: 'UPDATE_CUSTOMIZATION_ODD'
    })
    let xml = parser.parseFromString(state.odd.customization.updatedXml)
    xml = global.uselocaldom(xml)
    // console.log(xml.querySelector('dataSpec[ident="teidata.enumerated"]').outerHTML)
    expect(xml.querySelector('dataSpec[ident="teidata.enumerated"] valList > valItem').getAttribute('ident')).toEqual('test')
    expect(xml.querySelectorAll('dataSpec[ident="teidata.enumerated"] valList > valItem')[1].getAttribute('ident')).toEqual('test2')
  })

  it('should delete a valItem', () => {
    customJson = JSON.parse(customization)
    localJson = JSON.parse(localsource)
    const firstState = romajsApp({
      odd: {
        customization: { isFetching: false, json: customJson, xml: customizationXMLString },
        localsource: { isFetching: false, json: localJson }
      },
      selectedOdd: ''
    }, {
      type: 'DELETE_DATATYPE_VALITEM',
      datatype: 'teidata.xTruthValue',
      index: 1,
      value: 'inapplicable'
    })
    const state = romajsApp(firstState, {
      type: 'UPDATE_CUSTOMIZATION_ODD'
    })
    let xml = parser.parseFromString(state.odd.customization.updatedXml)
    xml = global.uselocaldom(xml)
    const valItems = xml.querySelectorAll('dataSpec[ident="teidata.xTruthValue"] valList > valItem')
    expect(valItems.length).toEqual(1)
    expect(valItems[0].getAttribute('ident')).toEqual('unknown')
  })

  it('should delete datatype content (not grouped)', () => {
    customJson = JSON.parse(customization)
    localJson = JSON.parse(localsource)
    const firstState = romajsApp({
      odd: {
        customization: { isFetching: false, json: customJson, xml: customizationXMLString },
        localsource: { isFetching: false, json: localJson }
      },
      selectedOdd: ''
    }, {
      type: 'DELETE_DATATYPE_CONTENT',
      datatype: 'teidata.enumerated',
      index: 0
    })
    const state = romajsApp(firstState, {
      type: 'UPDATE_CUSTOMIZATION_ODD'
    })
    let xml = parser.parseFromString(state.odd.customization.updatedXml)
    xml = global.uselocaldom(xml)
    expect(xml.querySelector('dataSpec[ident="teidata.enumerated"] content').children.length).toEqual(0)
  })

  it('should delete datatype content (grouped)', () => {
    customJson = JSON.parse(customization)
    localJson = JSON.parse(localsource)
    const firstState = romajsApp({
      odd: {
        customization: { isFetching: false, json: customJson, xml: customizationXMLString },
        localsource: { isFetching: false, json: localJson }
      },
      selectedOdd: ''
    }, {
      type: 'DELETE_DATATYPE_CONTENT',
      datatype: 'teidata.xTruthValue',
      index: 0
    })
    const state = romajsApp(firstState, {
      type: 'UPDATE_CUSTOMIZATION_ODD'
    })
    let xml = parser.parseFromString(state.odd.customization.updatedXml)
    xml = global.uselocaldom(xml)
    expect(xml.querySelector('dataSpec[ident="teidata.xTruthValue"] content').children.length).toEqual(1)
  })

  it('should move datatype content (not grouped)', () => {
    customJson = JSON.parse(customization)
    localJson = JSON.parse(localsource)

    // Update JSON data directly
    customJson.datatypes.forEach(dt => {
      if (dt.ident === 'teidata.enumerated') {
        dt.content.push({
          type: 'dataRef',
          name: 'string'
        })
      }
    })

    const firstState = romajsApp({
      odd: {
        customization: { isFetching: false, json: customJson, xml: customizationXMLString },
        localsource: { isFetching: false, json: localJson }
      },
      selectedOdd: ''
    }, {
      type: 'MOVE_DATATYPE_CONTENT',
      datatype: 'teidata.enumerated',
      indexFrom: 0,
      indexTo: 1
    })
    const state = romajsApp(firstState, {
      type: 'UPDATE_CUSTOMIZATION_ODD'
    })
    let xml = parser.parseFromString(state.odd.customization.updatedXml)
    xml = global.uselocaldom(xml)
    expect(xml.querySelectorAll('dataSpec[ident="teidata.enumerated"] dataRef')[0].getAttribute('name')).toEqual('string')
  })

  it('should move datatype content (grouped)', () => {
    customJson = JSON.parse(customization)
    localJson = JSON.parse(localsource)

    const firstState = romajsApp({
      odd: {
        customization: { isFetching: false, json: customJson, xml: customizationXMLString },
        localsource: { isFetching: false, json: localJson }
      },
      selectedOdd: ''
    }, {
      type: 'MOVE_DATATYPE_CONTENT',
      datatype: 'teidata.xTruthValue',
      indexFrom: 0,
      indexTo: 1
    })
    const state = romajsApp(firstState, {
      type: 'UPDATE_CUSTOMIZATION_ODD'
    })
    let xml = parser.parseFromString(state.odd.customization.updatedXml)
    xml = global.uselocaldom(xml)
    expect(xml.querySelector('dataSpec[ident="teidata.xTruthValue"] alternate').children[0].tagName).toEqual('valList')
  })

  it('should set datatype content grouping type (alternate to sequence)', () => {
    customJson = JSON.parse(customization)
    localJson = JSON.parse(localsource)

    const firstState = romajsApp({
      odd: {
        customization: { isFetching: false, json: customJson, xml: customizationXMLString },
        localsource: { isFetching: false, json: localJson }
      },
      selectedOdd: ''
    }, {
      type: 'SET_DATATYPE_CONTENT_GROUPING',
      datatype: 'teidata.xTruthValue',
      groupingType: 'sequence'
    })
    const state = romajsApp(firstState, {
      type: 'UPDATE_CUSTOMIZATION_ODD'
    })
    let xml = parser.parseFromString(state.odd.customization.updatedXml)
    xml = global.uselocaldom(xml)
    expect(xml.querySelector('dataSpec[ident="teidata.xTruthValue"] sequence')).toExist()
  })

  it('should set datatype content grouping type (alternate to unordered)', () => {
    customJson = JSON.parse(customization)
    localJson = JSON.parse(localsource)

    const firstState = romajsApp({
      odd: {
        customization: { isFetching: false, json: customJson, xml: customizationXMLString },
        localsource: { isFetching: false, json: localJson }
      },
      selectedOdd: ''
    }, {
      type: 'SET_DATATYPE_CONTENT_GROUPING',
      datatype: 'teidata.xTruthValue',
      groupingType: 'unordered'
    })
    const state = romajsApp(firstState, {
      type: 'UPDATE_CUSTOMIZATION_ODD'
    })
    let xml = parser.parseFromString(state.odd.customization.updatedXml)
    xml = global.uselocaldom(xml)
    expect(xml.querySelector('dataSpec[ident="teidata.xTruthValue"] content').children[0].tagName).toEqual('dataRef')
  })

  it('should create a new datatype', () => {
    customJson = JSON.parse(customization)
    localJson = JSON.parse(localsource)

    // Update JSON data directly
    customJson.datatypes.push({
      ident: 'datatype.new',
      module: 'core',
      content: [
        {
          type: 'alternate',
          content: [
            {
              type: 'dataRef',
              name: 'string'
            },
            {
              type: 'valList',
              valItem: [
                {
                  ident: 'a'
                },
                {
                  ident: 'b'
                }
              ]
            },
            {
              type: 'textNode'
            }
          ]
        }
      ],
      desc: [
        '<desc xmlns="http://tei-c.org/ns/1.0" xml:lang="en">dn</desc>'
      ],
      shortDesc: '',
      gloss: [],
      altIdent: [
        'dn'
      ],
      _isNew: true
    })

    const state = romajsApp({
      odd: {
        customization: { isFetching: false, json: customJson, xml: customizationXMLString },
        localsource: { isFetching: false, json: localJson }
      },
      selectedOdd: ''
    }, {
      type: 'UPDATE_CUSTOMIZATION_ODD'
    })
    let xml = parser.parseFromString(state.odd.customization.updatedXml)
    xml = global.uselocaldom(xml)
    const dataSpec = xml.querySelector('dataSpec[ident="datatype.new"]')
    expect(dataSpec).toExist()
    expect(dataSpec.querySelector('desc').textContent).toEqual('dn')
    expect(dataSpec.querySelector('altIdent').textContent).toEqual('dn')
    expect(dataSpec.querySelector('alternate dataRef') ).toExist()
    expect(dataSpec.querySelector('alternate valList') ).toExist()
    expect(dataSpec.querySelector('alternate textNode') ).toExist()
  })

  it('should deselect a datatype (module is selected, which is always the case in TEI)', () => {
    customJson = JSON.parse(customization)
    localJson = JSON.parse(localsource)
    const firstState = romajsApp({
      odd: {
        customization: { isFetching: false, json: customJson, xml: customizationXMLString },
        localsource: { isFetching: false, json: localJson }
      },
      selectedOdd: ''
    }, {
      type: 'EXCLUDE_DATATYPES',
      datatypes: ['teidata.certainty']
    })
    const state = romajsApp(firstState, {
      type: 'UPDATE_CUSTOMIZATION_ODD'
    })
    let xml = parser.parseFromString(state.odd.customization.updatedXml)
    xml = global.uselocaldom(xml)
    expect(xml.querySelector('dataSpec[ident="teidata.certainty"]').getAttribute('mode')).toEqual('delete')
    expect(xml.querySelector('dataSpec[ident="teidata.certainty"]').children.length).toEqual(0)
  })
})
