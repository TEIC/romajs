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

describe('Update Customization classes (handles UPDATE_CUSTOMIZATION_ODD)', () => {
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
      type: 'UPDATE_CLASS_DOCS',
      member: 'att.global.source',
      docEl: 'desc',
      content: '<desc xmlns="http://www.tei-c.org/ns/1.0" xml:lang="en">new desc</desc>',
      index: 0
    })
    const state = romajsApp(firstState, {
      type: 'UPDATE_CUSTOMIZATION_ODD'
    })
    let xml = parser.parseFromString(state.odd.customization.updatedXml)
    xml = global.usejsdom(xml)
    expect(xml.querySelector('classSpec[ident="att.global.source"] > desc').textContent).toEqual('new desc')
  })

  it('should change a model class\' documentation (altIdent, no previous change)', () => {
    customJson = JSON.parse(customization)
    localJson = JSON.parse(localsource)
    const firstState = romajsApp({
      odd: {
        customization: { isFetching: false, json: customJson, xml: customizationXMLString },
        localsource: { isFetching: false, json: localJson }
      },
      selectedOdd: ''
    }, {
      type: 'UPDATE_CLASS_DOCS',
      member: 'model.resourceLike',
      docEl: 'altIdent',
      content: 'resourceKinda',
      index: 0
    })
    const state = romajsApp(firstState, {
      type: 'UPDATE_CUSTOMIZATION_ODD'
    })
    let xml = parser.parseFromString(state.odd.customization.updatedXml)
    xml = global.usejsdom(xml)
    expect(xml.querySelector('classSpec[ident="model.resourceLike"] > altIdent').textContent).toEqual('resourceKinda')
  })

  it('should delete an attribute defined on an attribute class', () => {
    customJson = JSON.parse(customization)
    localJson = JSON.parse(localsource)
    const firstState = romajsApp({
      odd: {
        customization: { isFetching: false, json: customJson, xml: customizationXMLString },
        localsource: { isFetching: false, json: localJson }
      },
      selectedOdd: ''
    }, {
      type: 'DELETE_CLASS_ATTRIBUTE',
      member: 'att.global',
      attribute: 'n'
    })
    const state = romajsApp(firstState, {
      type: 'UPDATE_CUSTOMIZATION_ODD'
    })
    let xml = parser.parseFromString(state.odd.customization.updatedXml)
    xml = global.usejsdom(xml)
    expect(xml.querySelector('classSpec[ident="att.global"] > attList > attDef[ident="n"]').getAttribute('mode')).toEqual('delete')
  })

  it('should restore a deleted attribute defined on an attribute class', () => {
    customJson = JSON.parse(customization)
    localJson = JSON.parse(localsource)
    const firstState = romajsApp({
      odd: {
        customization: { isFetching: false, json: customJson, xml: customizationXMLString },
        localsource: { isFetching: false, json: localJson }
      },
      selectedOdd: ''
    }, {
      type: 'RESTORE_CLASS_ATTRIBUTE',
      member: 'att.global',
      attribute: 'xml:space'
    })
    const state = romajsApp(firstState, {
      type: 'UPDATE_CUSTOMIZATION_ODD'
    })
    let xml = parser.parseFromString(state.odd.customization.updatedXml)
    xml = global.usejsdom(xml)
    expect(xml.querySelector('classSpec[ident="att.global"] > attList > attDef[ident="xml:space"]')).toNotExist()
  })

  it('should change an attribute on an attribute class.', () => {
    customJson = JSON.parse(customization)
    localJson = JSON.parse(localsource)

    const firstState = romajsApp({
      odd: {
        customization: { isFetching: false, json: customJson, xml: customizationXMLString },
        localsource: { isFetching: false, json: localJson }
      },
      selectedOdd: ''
    }, {
      type: 'CHANGE_CLASS_ATTRIBUTE',
      className: 'att.global',
      attName: 'n'
    })
    const secondState = romajsApp(firstState, {
      type: 'SET_USAGE',
      member: 'att.global',
      memberType: 'class',
      attr: 'n',
      usage: 'req'
    })
    const state = romajsApp(secondState, {
      type: 'UPDATE_CUSTOMIZATION_ODD'
    })
    let xml = parser.parseFromString(state.odd.customization.updatedXml)
    xml = global.usejsdom(xml)
    expect(xml.querySelector('classSpec[ident="att.global"] > attList attDef[ident="n"]').getAttribute('mode')).toEqual('change')
    expect(xml.querySelector('classSpec[ident="att.global"] > attList attDef[ident="n"]').getAttribute('usage')).toEqual('req')
  })

  it('should restore add a new attribute defined on an attribute class', () => {
    customJson = JSON.parse(customization)
    localJson = JSON.parse(localsource)
    const firstState = romajsApp({
      odd: {
        customization: { isFetching: false, json: customJson, xml: customizationXMLString },
        localsource: { isFetching: false, json: localJson }
      },
      selectedOdd: ''
    }, {
      type: 'ADD_CLASS_ATTRIBUTE',
      member: 'att.global',
      attribute: 'dummy'
    })
    const state = romajsApp(firstState, {
      type: 'UPDATE_CUSTOMIZATION_ODD'
    })
    let xml = parser.parseFromString(state.odd.customization.updatedXml)
    xml = global.usejsdom(xml)
    expect(xml.querySelector('classSpec[ident="att.global"] > attList > attDef[ident="dummy"]').getAttribute('mode')).toEqual('add')
  })

  it('should change a class\' attribute classes (add membership)', () => {
    customJson = JSON.parse(customization)
    localJson = JSON.parse(localsource)
    const firstState = romajsApp({
      odd: {
        customization: { isFetching: false, json: customJson, xml: customizationXMLString },
        localsource: { isFetching: false, json: localJson }
      },
      selectedOdd: ''
    }, {
      type: 'ADD_MEMBERSHIP_TO_CLASS',
      member: 'att.global',
      className: 'att.divLike',
      classType: 'atts'
    })
    const state = romajsApp(firstState, {
      type: 'UPDATE_CUSTOMIZATION_ODD'
    })
    let xml = parser.parseFromString(state.odd.customization.updatedXml)
    xml = global.usejsdom(xml)
    expect(xml.querySelector('classSpec[ident="att.global"] > classes > memberOf').getAttribute('key')).toEqual('att.divLike')
  })

  it('should change a class\' attribute classes (remove membership)', () => {
    customJson = JSON.parse(customization)
    localJson = JSON.parse(localsource)
    const firstState = romajsApp({
      odd: {
        customization: { isFetching: false, json: customJson, xml: customizationXMLString },
        localsource: { isFetching: false, json: localJson }
      },
      selectedOdd: ''
    }, {
      type: 'REMOVE_MEMBERSHIP_TO_CLASS',
      member: 'att.global',
      className: 'att.global.rendition',
      classType: 'atts'
    })
    const state = romajsApp(firstState, {
      type: 'UPDATE_CUSTOMIZATION_ODD'
    })
    let xml = parser.parseFromString(state.odd.customization.updatedXml)
    xml = global.usejsdom(xml)
    expect(xml.querySelector('classSpec[ident="att.global"] > classes > memberOf[key="att.global.rendition"]').getAttribute('mode')).toEqual('delete')
  })

  // RESTORE_MEMBERSHIPS_TO_CLASS and CLEAR_MEMBERSHIPS_TO_CLASS don't need testing here.
})
