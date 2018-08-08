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

describe('Update Customization (handles UPDATE_CUSTOMIZATION_ODD)', () => {
  it('should add modules', () => {
    customJson = JSON.parse(customization)
    localJson = JSON.parse(localsource)
    const firstState = romajsApp({
      odd: {
        customization: { isFetching: false, json: customJson, xml: customizationXMLString },
        localsource: { isFetching: false, json: localJson }
      },
      selectedOdd: ''
    }, {
      type: 'INCLUDE_MODULES',
      modules: ['linking']
    })
    const state = romajsApp(firstState, {
      type: 'UPDATE_CUSTOMIZATION_ODD'
    })
    const xml = parser.parseFromString(state.odd.customization.xml)
    expect(Array.from(xml.getElementsByTagName('moduleRef')).filter(m => {
      return m.getAttribute('key') === 'linking'
    }).length).toEqual(1)
  })

  it('should remove modules (and related elementSpecs)', () => {
    customJson = JSON.parse(customization)
    localJson = JSON.parse(localsource)

    // Change ODD data for testing
    const testXml = customizationXML.cloneNode(true)
    const fileDesc = testXml.createElement('elementSpec')
    fileDesc.setAttribute('ident', 'fileDesc')
    fileDesc.setAttribute('mode', 'change')
    testXml.getElementsByTagName('schemaSpec')[0].appendChild(fileDesc)
    const testXmlString = serializer.serializeToString(testXml)

    // The JSON file doesn't need updating

    const firstState = romajsApp({
      odd: {
        customization: { isFetching: false, json: customJson, xml: testXmlString },
        localsource: { isFetching: false, json: localJson }
      },
      selectedOdd: ''
    }, {
      type: 'EXCLUDE_MODULES',
      modules: ['header']
    })
    const state = romajsApp(firstState, {
      type: 'UPDATE_CUSTOMIZATION_ODD'
    })
    const xml = parser.parseFromString(state.odd.customization.xml)
    expect(Array.from(xml.getElementsByTagName('moduleRef')).filter(m => {
      return m.getAttribute('key') === 'header'
    }).length).toEqual(0)
    expect(Array.from(xml.getElementsByTagName('elementSpec')).filter(m => {
      return m.getAttribute('ident') === 'fileDesc'
    })[0].getAttribute('mode')).toEqual('delete')
  })

  it('should remove modules (and any related elementRefs)', () => {
    customJson = JSON.parse(customization)
    localJson = JSON.parse(localsource)

    // Change ODD data for testing
    const testXml = customizationXML.cloneNode(true)
    const msDescRef = testXml.createElement('elementRef')
    msDescRef.setAttribute('key', 'msDesc')
    testXml.getElementsByTagName('schemaSpec')[0].appendChild(msDescRef)
    const testXmlString = serializer.serializeToString(testXml)

    // Update JSON data accordingly
    customJson.modules.push(
      localJson.modules.filter(x => (x.ident === 'msdescription'))[0]
    )
    customJson.elements.push(
      localJson.elements.filter(x => (x.ident === 'msDesc'))[0]
    )

    const firstState = romajsApp({
      odd: {
        customization: { isFetching: false, json: customJson, xml: testXmlString },
        localsource: { isFetching: false, json: localJson }
      },
      selectedOdd: ''
    }, {
      type: 'EXCLUDE_MODULES',
      modules: ['msdescription']
    })
    const state = romajsApp(firstState, {
      type: 'UPDATE_CUSTOMIZATION_ODD'
    })
    const xml = parser.parseFromString(state.odd.customization.xml)
    expect(Array.from(xml.getElementsByTagName('moduleRef')).filter(m => {
      return m.getAttribute('key') === 'msdescription'
    }).length).toEqual(0)
    expect(Array.from(xml.getElementsByTagName('elementRef')).filter(m => {
      return m.getAttribute('key') === 'msDesc'
    }).length).toEqual(0)
  })

  it('should include elements by adjusting @include', () => {
    customJson = JSON.parse(customization)
    localJson = JSON.parse(localsource)

    // Change ODD data for testing
    const testXml = customizationXML.cloneNode(true)
    const gaiji = testXml.createElement('moduleRef')
    gaiji.setAttribute('key', 'gaiji')
    gaiji.setAttribute('include', 'char')
    testXml.getElementsByTagName('schemaSpec')[0].appendChild(gaiji)
    const testXmlString = serializer.serializeToString(testXml)

    // Update JSON data accordingly
    customJson.modules.push(
      localJson.modules.filter(x => (x.ident === 'gaiji'))[0]
    )
    customJson.elements.push(
      localJson.elements.filter(x => (x.ident === 'char'))[0]
    )

    const firstState = romajsApp({
      odd: {
        customization: { isFetching: false, json: customJson, xml: testXmlString },
        localsource: { isFetching: false, json: localJson }
      },
      selectedOdd: ''
    }, {
      type: 'INCLUDE_ELEMENTS',
      elements: ['charDecl']
    })
    const state = romajsApp(firstState, {
      type: 'UPDATE_CUSTOMIZATION_ODD'
    })
    const xml = parser.parseFromString(state.odd.customization.xml)
    expect(Array.from(xml.getElementsByTagName('moduleRef')).filter(m => {
      return m.getAttribute('key') === 'gaiji'
    })[0].getAttribute('include')).toEqual('char charDecl')
  })

  it('should include elements by adjusting @include (on new moduleRef)', () => {
    customJson = JSON.parse(customization)
    localJson = JSON.parse(localsource)

    const firstState = romajsApp({
      odd: {
        customization: { isFetching: false, json: customJson, xml: customizationXMLString },
        localsource: { isFetching: false, json: localJson }
      },
      selectedOdd: ''
    }, {
      type: 'INCLUDE_ELEMENTS',
      elements: ['char']
    })
    const state = romajsApp(firstState, {
      type: 'UPDATE_CUSTOMIZATION_ODD'
    })
    const xml = parser.parseFromString(state.odd.customization.xml)

    expect(Array.from(xml.getElementsByTagName('moduleRef')).filter(m => {
      return m.getAttribute('key') === 'gaiji'
    })[0].getAttribute('include')).toEqual('char')
  })

  it('should include elements by adjusting @except', () => {
    customJson = JSON.parse(customization)
    localJson = JSON.parse(localsource)

    // Change ODD data for testing
    const testXml = customizationXML.cloneNode(true)
    const gaiji = testXml.createElement('moduleRef')
    gaiji.setAttribute('key', 'gaiji')
    gaiji.setAttribute('except', 'charDecl charName')
    testXml.getElementsByTagName('schemaSpec')[0].appendChild(gaiji)
    const testXmlString = serializer.serializeToString(testXml)

    // Update JSON data accordingly
    customJson.modules.push(
      localJson.modules.filter(x => (x.ident === 'gaiji'))[0]
    )
    customJson.elements.push(
      ...localJson.elements.filter(x => {
        return x.module === 'gaiji' && x.ident !== 'charDecl' && x.ident !== 'charName'
      })
    )

    const firstState = romajsApp({
      odd: {
        customization: { isFetching: false, json: customJson, xml: testXmlString },
        localsource: { isFetching: false, json: localJson }
      },
      selectedOdd: ''
    }, {
      type: 'INCLUDE_ELEMENTS',
      elements: ['charDecl']
    })
    const state = romajsApp(firstState, {
      type: 'UPDATE_CUSTOMIZATION_ODD'
    })
    const xml = parser.parseFromString(state.odd.customization.xml)
    expect(Array.from(xml.getElementsByTagName('moduleRef')).filter(m => {
      return m.getAttribute('key') === 'gaiji'
    })[0].getAttribute('except')).toEqual('charName')
  })

  it('should include elements by adjusting @except (with one item)', () => {
    customJson = JSON.parse(customization)
    localJson = JSON.parse(localsource)

    // Change ODD data for testing
    const testXml = customizationXML.cloneNode(true)
    const gaiji = testXml.createElement('moduleRef')
    gaiji.setAttribute('key', 'gaiji')
    gaiji.setAttribute('except', 'charDecl')
    testXml.getElementsByTagName('schemaSpec')[0].appendChild(gaiji)
    const testXmlString = serializer.serializeToString(testXml)

    // Update JSON data accordingly
    customJson.modules.push(
      localJson.modules.filter(x => (x.ident === 'gaiji'))[0]
    )
    customJson.elements.push(
      ...localJson.elements.filter(x => {
        return x.module === 'gaiji' && x.ident !== 'charDecl'
      })
    )

    const firstState = romajsApp({
      odd: {
        customization: { isFetching: false, json: customJson, xml: testXmlString },
        localsource: { isFetching: false, json: localJson }
      },
      selectedOdd: ''
    }, {
      type: 'INCLUDE_ELEMENTS',
      elements: ['charDecl']
    })
    const state = romajsApp(firstState, {
      type: 'UPDATE_CUSTOMIZATION_ODD'
    })
    const xml = parser.parseFromString(state.odd.customization.xml)
    expect(Array.from(xml.getElementsByTagName('moduleRef')).filter(m => {
      return m.getAttribute('key') === 'gaiji'
    })[0].getAttribute('except')).toNotExist()
  })

  it('should include elements by removing elementSpec[@mode=delete]', () => {
    customJson = JSON.parse(customization)
    localJson = JSON.parse(localsource)

    // Change ODD data for testing
    const testXml = customizationXML.cloneNode(true)
    const gaiji = testXml.createElement('moduleRef')
    gaiji.setAttribute('key', 'gaiji')
    testXml.getElementsByTagName('schemaSpec')[0].appendChild(gaiji)
    const char = testXml.createElement('elementSpec')
    char.setAttribute('ident', 'char')
    char.setAttribute('mode', 'delete')
    testXml.getElementsByTagName('schemaSpec')[0].appendChild(char)
    const testXmlString = serializer.serializeToString(testXml)

    // Update JSON data accordingly
    customJson.modules.push(
      localJson.modules.filter(x => (x.ident === 'gaiji'))[0]
    )
    customJson.elements.push(
      ...localJson.elements.filter(x => {
        return x.module === 'gaiji' && x.ident !== 'char'
      })
    )

    const firstState = romajsApp({
      odd: {
        customization: { isFetching: false, json: customJson, xml: testXmlString },
        localsource: { isFetching: false, json: localJson }
      },
      selectedOdd: ''
    }, {
      type: 'INCLUDE_ELEMENTS',
      elements: ['char']
    })

    const state = romajsApp(firstState, {
      type: 'UPDATE_CUSTOMIZATION_ODD'
    })
    const xml = parser.parseFromString(state.odd.customization.xml)

    expect(Array.from(xml.getElementsByTagName('elementSpec')).filter(m => {
      return m.getAttribute('ident') === 'char'
    })[0]).toNotExist()
  })

  it('should change an element\'s documentation (desc, no previous change)', () => {
    customJson = JSON.parse(customization)
    localJson = JSON.parse(localsource)
    const firstState = romajsApp({
      odd: {
        customization: { isFetching: false, json: customJson, xml: customizationXMLString },
        localsource: { isFetching: false, json: localJson }
      },
      selectedOdd: ''
    }, {
      type: 'UPDATE_ELEMENT_DOCS',
      element: 'div',
      docEl: 'desc',
      content: '<desc xmlns="http://www.tei-c.org/ns/1.0" xml:lang="en">new desc</desc>',
      index: 0
    })
    const state = romajsApp(firstState, {
      type: 'UPDATE_CUSTOMIZATION_ODD'
    })
    let xml = parser.parseFromString(state.odd.customization.xml)
    xml = global.usejsdom(xml)
    expect(xml.querySelector('elementSpec[ident="div"] > desc').textContent).toEqual('new desc')
  })

  it('should change an element\'s documentation (desc, previously changed)', () => {
    customJson = JSON.parse(customization)
    localJson = JSON.parse(localsource)

    // Change ODD data for testing
    const testXml = customizationXML.cloneNode(true)
    const edDesc0 = '<desc mode="change">some desc1</desc>'
    const edDesc1 = '<desc mode="change">some desc2</desc>'
    const ed = `<elementSpec ident="div" mode="change">${edDesc0}${edDesc1}</elementSpec>`
    const edEl = parser.parseFromString(ed)
    testXml.getElementsByTagName('schemaSpec')[0].appendChild(edEl)
    const testXmlString = serializer.serializeToString(testXml)

    // Update JSON data accordingly
    customJson.elements = customJson.elements.map(el => {
      if (el.ident === 'div') {
        el.desc[0] = edDesc0
        el.desc[1] = edDesc1
      }
      return el
    })

    const firstState = romajsApp({
      odd: {
        customization: { isFetching: false, json: customJson, xml: testXmlString },
        localsource: { isFetching: false, json: localJson }
      },
      selectedOdd: ''
    }, {
      type: 'UPDATE_ELEMENT_DOCS',
      element: 'div',
      docEl: 'desc',
      content: '<desc xmlns="http://www.tei-c.org/ns/1.0" xml:lang="en">new desc</desc>',
      index: 1
    })
    const state = romajsApp(firstState, {
      type: 'UPDATE_CUSTOMIZATION_ODD'
    })
    let xml = parser.parseFromString(state.odd.customization.xml)
    xml = global.usejsdom(xml)
    expect(xml.querySelector('elementSpec[ident="div"] > desc:nth-child(2)').textContent).toEqual('new desc')
  })
})
