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
    const xml = parser.parseFromString(state.odd.customization.updatedXml)
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
    const xml = parser.parseFromString(state.odd.customization.updatedXml)
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
    const xml = parser.parseFromString(state.odd.customization.updatedXml)
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
    const xml = parser.parseFromString(state.odd.customization.updatedXml)
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
    const xml = parser.parseFromString(state.odd.customization.updatedXml)
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
    const xml = parser.parseFromString(state.odd.customization.updatedXml)
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
    const xml = parser.parseFromString(state.odd.customization.updatedXml)
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
    const xml = parser.parseFromString(state.odd.customization.updatedXml)
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
    let xml = parser.parseFromString(state.odd.customization.updatedXml)
    xml = global.usejsdom(xml)
    expect(xml.querySelector('elementSpec[ident="div"] > desc').textContent).toEqual('new desc')
  })

  it('should change an element\'s documentation (altIdent, entirely new)', () => {
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
      docEl: 'altIdent',
      content: 'myDiv',
      index: 0
    })
    const state = romajsApp(firstState, {
      type: 'UPDATE_CUSTOMIZATION_ODD'
    })
    let xml = parser.parseFromString(state.odd.customization.updatedXml)
    xml = global.usejsdom(xml)
    expect(xml.querySelector('elementSpec[ident="div"] > altIdent').textContent).toEqual('myDiv')
  })

  it('should change an element\'s documentation (altIdent, preceded by another previously changed, then deleted)', () => {
    customJson = JSON.parse(customization)
    localJson = JSON.parse(localsource)

    // Change ODD data for testing
    const testXml = customizationXML.cloneNode(true)
    const altIdent = '<altIdent>alt</altIdent>'
    const ed = `<elementSpec ident="div" mode="change">${altIdent}</elementSpec>`
    const edEl = parser.parseFromString(ed)
    testXml.getElementsByTagName('schemaSpec')[0].appendChild(edEl)
    const testXmlString = serializer.serializeToString(testXml)

    // Update JSON data accordingly
    customJson.elements = customJson.elements.map(el => {
      if (el.ident === 'div') {
        el.altIdent[0] = altIdent
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
      docEl: 'altIdent',
      content: {deleted: true},
      index: 0
    })
    const secondState = romajsApp(firstState, {
      type: 'UPDATE_ELEMENT_DOCS',
      element: 'div',
      docEl: 'altIdent',
      content: 'alt2',
      index: 1
    })
    const state = romajsApp(secondState, {
      type: 'UPDATE_CUSTOMIZATION_ODD'
    })
    let xml = parser.parseFromString(state.odd.customization.updatedXml)
    xml = global.usejsdom(xml)
    expect(xml.querySelector('elementSpec[ident="div"] > altIdent').textContent).toEqual('alt2')
  })

  it('should change an element\'s documentation (desc, previously changed)', () => {
    customJson = JSON.parse(customization)
    localJson = JSON.parse(localsource)

    // Change ODD data for testing
    const testXml = customizationXML.cloneNode(true)
    const edDesc0 = '<desc>some desc1</desc>'
    const edDesc1 = '<desc>some desc2</desc>'
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
    let xml = parser.parseFromString(state.odd.customization.updatedXml)
    xml = global.usejsdom(xml)
    expect(xml.querySelector('elementSpec[ident="div"] > desc:nth-child(2)').textContent).toEqual('new desc')
  })

  it('should change an element\'s documentation (desc, previously changed now back to original)', () => {
    customJson = JSON.parse(customization)
    localJson = JSON.parse(localsource)

    // Change ODD data for testing
    const testXml = customizationXML.cloneNode(true)
    const edDesc0 = '<desc>some desc1</desc>'
    const ed = `<elementSpec ident="div" mode="change">${edDesc0}</elementSpec>`
    const edEl = parser.parseFromString(ed)
    testXml.getElementsByTagName('schemaSpec')[0].appendChild(edEl)
    const testXmlString = serializer.serializeToString(testXml)

    // Update JSON data accordingly
    customJson.elements = customJson.elements.map(el => {
      if (el.ident === 'div') {
        el.desc[0] = edDesc0
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
      content: '<desc versionDate="2018-01-14" xml:lang="en">contains a subdivision of the front, body, or back of a text.</desc>',
      index: 0
    })
    const state = romajsApp(firstState, {
      type: 'UPDATE_CUSTOMIZATION_ODD'
    })
    let xml = parser.parseFromString(state.odd.customization.updatedXml)
    xml = global.usejsdom(xml)
    expect(xml.querySelector('elementSpec[ident="div"] > desc')).toNotExist()
  })

  it('should change an element\'s attribute classes (add membership)', () => {
    customJson = JSON.parse(customization)
    localJson = JSON.parse(localsource)
    const firstState = romajsApp({
      odd: {
        customization: { isFetching: false, json: customJson, xml: customizationXMLString },
        localsource: { isFetching: false, json: localJson }
      },
      selectedOdd: ''
    }, {
      type: 'ADD_ELEMENT_ATTRIBUTE_CLASS',
      element: 'div',
      className: 'att.sortable'
    })
    const state = romajsApp(firstState, {
      type: 'UPDATE_CUSTOMIZATION_ODD'
    })
    let xml = parser.parseFromString(state.odd.customization.updatedXml)
    xml = global.usejsdom(xml)
    expect(xml.querySelector('elementSpec[ident="div"] > classes > memberOf').getAttribute('key')).toEqual('att.sortable')
  })

  it('should change an element\'s attribute classes (add membership after documentation elements)', () => {
    customJson = JSON.parse(customization)
    localJson = JSON.parse(localsource)

    // Change ODD data for testing
    const testXml = customizationXML.cloneNode(true)
    const ed = `<elementSpec ident="div" mode="change"><desc/><altIdent/><gloss/><desc/><model/></elementSpec>`
    const edEl = parser.parseFromString(ed)
    testXml.getElementsByTagName('schemaSpec')[0].appendChild(edEl)
    const testXmlString = serializer.serializeToString(testXml)

    const firstState = romajsApp({
      odd: {
        customization: { isFetching: false, json: customJson, xml: testXmlString },
        localsource: { isFetching: false, json: localJson }
      },
      selectedOdd: ''
    }, {
      type: 'ADD_ELEMENT_ATTRIBUTE_CLASS',
      element: 'div',
      className: 'att.sortable'
    })
    const state = romajsApp(firstState, {
      type: 'UPDATE_CUSTOMIZATION_ODD'
    })
    let xml = parser.parseFromString(state.odd.customization.updatedXml)
    xml = global.usejsdom(xml)
    expect(xml.querySelector('elementSpec[ident="div"] > classes > memberOf').getAttribute('key')).toEqual('att.sortable')
    // check that it's in the right place
  })

  it('should change an element\'s attribute classes (remove membership)', () => {
    customJson = JSON.parse(customization)
    localJson = JSON.parse(localsource)

    const firstState = romajsApp({
      odd: {
        customization: { isFetching: false, json: customJson, xml: customizationXMLString },
        localsource: { isFetching: false, json: localJson }
      },
      selectedOdd: ''
    }, {
      type: 'DELETE_ELEMENT_ATTRIBUTE_CLASS',
      element: 'div',
      className: 'att.global'
    })
    const state = romajsApp(firstState, {
      type: 'UPDATE_CUSTOMIZATION_ODD'
    })
    let xml = parser.parseFromString(state.odd.customization.updatedXml)
    xml = global.usejsdom(xml)
    expect(xml.querySelector('elementSpec[ident="div"] > classes > memberOf[key="att.global"]').getAttribute('mode')).toEqual('delete')
  })

  it('should create a new attribute on element', () => {
    customJson = JSON.parse(customization)
    localJson = JSON.parse(localsource)

    const firstState = romajsApp({
      odd: {
        customization: { isFetching: false, json: customJson, xml: customizationXMLString },
        localsource: { isFetching: false, json: localJson }
      },
      selectedOdd: ''
    }, {
      type: 'ADD_ELEMENT_ATTRIBUTE',
      element: 'title',
      attribute: 'newAtt'
    })
    const state = romajsApp(firstState, {
      type: 'UPDATE_CUSTOMIZATION_ODD'
    })
    state
    let xml = parser.parseFromString(state.odd.customization.updatedXml)
    xml = global.usejsdom(xml)
    expect(xml.querySelector('elementSpec[ident="title"] > attList > attDef[ident="newAtt"]')).toExist()
  })

  // Add test for cloned attribute

  // Add test for deleting attribute defined of element

  // Add test for deleting attribute defined on class

  // Add test for restorting attribute currently deleted in customization

  it('should change an attribute defined on local element and some changes are already done.', () => {
    customJson = JSON.parse(customization)
    localJson = JSON.parse(localsource)

    // Change ODD data for testing
    const testXml = global.usejsdom(customizationXML)
    const attList = testXml.querySelector('elementSpec[ident="title"] attList')
    attList.innerHTML = '<attDef ident="level" mode="change"><desc>...</desc></attDef>'
    const testXmlString = testXml.documentElement.outerHTML

    // Update JSON data accordingly
    // title, being inherited from a class (!), is already changed
    customJson.elements = customJson.elements.map(el => {
      if (el.ident === 'title') {
        el.attributes = [{
          onElement: true,
          ident: 'level',
          mode: 'change',
          ns: '',
          usage: '',
          desc: ['<desc>...</desc>'],
          shortDesc: '',
          gloss: [  ],
          altIdent: [  ],
          valDesc: [  ] }]
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
      type: 'UPDATE_ATTRIBUTE_DOCS',
      member: 'title',
      memberType: 'element',
      attr: 'level',
      docEl: 'desc',
      content: `<desc>!!!</desc>`,
      index: 0
    })
    const state = romajsApp(firstState, {
      type: 'UPDATE_CUSTOMIZATION_ODD'
    })
    let xml = parser.parseFromString(state.odd.customization.updatedXml)
    xml = global.usejsdom(xml)
    expect(xml.querySelector('elementSpec[ident="title"] > attList > attDef[ident="level"] > desc').textContent).toEqual('!!!')
  })

  it('should change an attribute defined on local element and some changes are already done (return to localsource value).', () => {
    customJson = JSON.parse(customization)
    localJson = JSON.parse(localsource)

    // Change ODD data for testing
    const testXml = global.usejsdom(customizationXML)
    const attList = testXml.querySelector('elementSpec[ident="title"] attList')
    attList.innerHTML = '<attDef ident="level" mode="change" usage="req"/>'
    const testXmlString = testXml.documentElement.outerHTML

    // Update JSON data accordingly
    // title, being inherited from a class (!), is already changed
    customJson.elements = customJson.elements.map(el => {
      if (el.ident === 'title') {
        el.attributes = [{
          onElement: true,
          ident: 'level',
          mode: 'change',
          ns: '',
          usage: 'req',
          desc: [  ],
          shortDesc: '',
          gloss: [  ],
          altIdent: [  ],
          valDesc: [  ] }]
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
      type: 'SET_USAGE',
      member: 'title',
      memberType: 'element',
      attr: 'level',
      usage: 'opt'
    })
    const state = romajsApp(firstState, {
      type: 'UPDATE_CUSTOMIZATION_ODD'
    })
    let xml = parser.parseFromString(state.odd.customization.updatedXml)
    xml = global.usejsdom(xml)
    expect(xml.querySelector('elementSpec[ident="title"] > attList > attDef[ident="level"]').getAttribute('usage')).toNotExist()
  })

  it('should change an attribute defined on local element and some changes are already done. (desc returning to localsource value)', () => {
    customJson = JSON.parse(customization)
    localJson = JSON.parse(localsource)

    // Change ODD data for testing
    const testXml = global.usejsdom(customizationXML)
    const attList = testXml.querySelector('elementSpec[ident="title"] attList')
    attList.innerHTML = '<attDef ident="level" mode="change"><desc>...</desc></attDef>'
    const testXmlString = testXml.documentElement.outerHTML

    // Update JSON data accordingly
    // title, being inherited from a class (!), is already changed
    customJson.elements = customJson.elements.map(el => {
      if (el.ident === 'title') {
        el.attributes = [{
          onElement: true,
          ident: 'level',
          mode: 'change',
          ns: '',
          usage: '',
          desc: ['<desc>...</desc>'],
          shortDesc: '',
          gloss: [  ],
          altIdent: [  ],
          valDesc: [  ] }]
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
      type: 'UPDATE_ATTRIBUTE_DOCS',
      member: 'title',
      memberType: 'element',
      attr: 'level',
      docEl: 'desc',
      content: `<desc versionDate="2018-03-05" xml:lang="en">indicates the bibliographic level for a title, that is, whether
      it identifies an article, book, journal, series, or
      unpublished material.</desc>`,
      index: 0
    })
    const state = romajsApp(firstState, {
      type: 'UPDATE_CUSTOMIZATION_ODD'
    })
    let xml = parser.parseFromString(state.odd.customization.updatedXml)
    xml = global.usejsdom(xml)
    expect(xml.querySelector('elementSpec[ident="title"] > attList > attDef[ident="level"] > desc')).toNotExist()
  })

  it('should change an attribute defined on local element.', () => {
    customJson = JSON.parse(customization)
    localJson = JSON.parse(localsource)

    // Change ODD data for testing
    const testXml = global.usejsdom(customizationXML)
    const attList = testXml.querySelector('elementSpec[ident="title"] attList')
    attList.parentNode.removeChild(attList)
    const testXmlString = testXml.documentElement.outerHTML

    // Update JSON data accordingly
    customJson.elements = customJson.elements.map(el => {
      if (el.ident === 'title') {
        el.attributes = []
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
      type: 'CHANGE_ELEMENT_ATTRIBUTE',
      element: 'title',
      attName: 'level'
    })
    const secondState = romajsApp(firstState, {
      type: 'SET_USAGE',
      member: 'title',
      memberType: 'element',
      attr: 'level',
      usage: 'req'
    })
    const state = romajsApp(secondState, {
      type: 'UPDATE_CUSTOMIZATION_ODD'
    })
    let xml = parser.parseFromString(state.odd.customization.updatedXml)
    xml = global.usejsdom(xml)
    expect(xml.querySelector('elementSpec[ident="title"] > attList > attDef[ident="level"]').getAttribute('usage')).toEqual('req')
  })

  it('should change an attribute defined only on customized element.', () => {
    customJson = JSON.parse(customization)
    localJson = JSON.parse(localsource)

    // Change ODD data for testing
    const testXml = global.usejsdom(customizationXML)
    const attList = testXml.querySelector('elementSpec[ident="title"] attList')
    const attDef = testXml.createElementNS('http://www.tei-c.org/ns/1.0', 'attDef')
    attDef.setAttribute('ident', 'type2')
    attDef.setAttribute('mode', 'add')
    attDef.setAttribute('usage', 'req')
    attList.appendChild(attDef)
    const testXmlString = testXml.documentElement.outerHTML

    // Update JSON data accordingly
    customJson.elements = customJson.elements.map(el => {
      if (el.ident === 'title') {
        el.attributes.push({
          onElement: true,
          ident: 'type2',
          mode: 'add',
          ns: '',
          usage: 'req',
          desc: [  ],
          shortDesc: '',
          gloss: [  ],
          altIdent: [  ],
          valDesc: [  ] })
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
      type: 'CHANGE_ELEMENT_ATTRIBUTE',
      element: 'title',
      attName: 'type2'
    })
    const secondState = romajsApp(firstState, {
      type: 'SET_USAGE',
      member: 'title',
      memberType: 'element',
      attr: 'type2',
      usage: 'opt'
    })
    const state = romajsApp(secondState, {
      type: 'UPDATE_CUSTOMIZATION_ODD'
    })
    let xml = parser.parseFromString(state.odd.customization.updatedXml)
    xml = global.usejsdom(xml)
    expect(xml.querySelector('elementSpec[ident="title"] > attList > attDef[ident="type2"]').getAttribute('mode')).toEqual('add')
    expect(xml.querySelector('elementSpec[ident="title"] > attList > attDef[ident="type2"]').getAttribute('usage')).toEqual('opt')
  })

  it('should change an element attribute inherited from a class.', () => {
    customJson = JSON.parse(customization)
    localJson = JSON.parse(localsource)

    const firstState = romajsApp({
      odd: {
        customization: { isFetching: false, json: customJson, xml: customizationXMLString },
        localsource: { isFetching: false, json: localJson }
      },
      selectedOdd: ''
    }, {
      type: 'CHANGE_CLASS_ATTRIBUTE_ON_ELEMENT',
      element: 'title',
      className: 'att.canonical',
      attName: 'key'
    })
    const secondState = romajsApp(firstState, {
      type: 'SET_USAGE',
      member: 'title',
      memberType: 'element',
      attr: 'key',
      usage: 'req'
    })
    const state = romajsApp(secondState, {
      type: 'UPDATE_CUSTOMIZATION_ODD'
    })
    let xml = parser.parseFromString(state.odd.customization.updatedXml)
    xml = global.usejsdom(xml)
    expect(xml.querySelector('elementSpec[ident="title"] > attList > attDef[ident="key"]').getAttribute('mode')).toEqual('change')
    expect(xml.querySelector('elementSpec[ident="title"] > attList > attDef[ident="key"]').getAttribute('usage')).toEqual('req')
  })

  it('should change an element attribute inherited from a class that is already changed by the customization.', () => {
    customJson = JSON.parse(customization)
    localJson = JSON.parse(localsource)

    // Change ODD data for testing
    const testXml = global.usejsdom(customizationXML)
    const attList = testXml.querySelector('elementSpec[ident="title"] attList')
    const attDef = testXml.createElementNS('http://www.tei-c.org/ns/1.0', 'attDef')
    attDef.setAttribute('ident', 'key')
    attDef.setAttribute('mode', 'change')
    attDef.setAttribute('usage', 'req')
    attList.appendChild(attDef)
    const testXmlString = testXml.documentElement.outerHTML

    // Update JSON data accordingly
    customJson.elements = customJson.elements.map(el => {
      if (el.ident === 'title') {
        el.attributes.push({
          onElement: false,
          ident: 'key',
          mode: 'change',
          ns: '',
          usage: 'req',
          desc: [  ],
          shortDesc: '',
          gloss: [  ],
          altIdent: [  ],
          valDesc: [  ] })
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
      type: 'CHANGE_CLASS_ATTRIBUTE_ON_ELEMENT',
      element: 'title',
      className: 'att.canonical',
      attName: 'key'
    })
    const secondState = romajsApp(firstState, {
      type: 'SET_USAGE',
      member: 'title',
      memberType: 'element',
      attr: 'key',
      usage: 'opt'
    })
    const state = romajsApp(secondState, {
      type: 'UPDATE_CUSTOMIZATION_ODD'
    })
    let xml = parser.parseFromString(state.odd.customization.updatedXml)
    xml = global.usejsdom(xml)
    // Returning to original definition means that usage should not be there any longer.
    // This test may need to be updated if better cleanup is implemented.
    expect(xml.querySelector('elementSpec[ident="title"] > attList > attDef[ident="key"]').getAttribute('usage')).toNotExist()
  })

  it('should change the valList type of an attribute defined on an element.', () => {
    customJson = JSON.parse(customization)
    localJson = JSON.parse(localsource)

    // Change ODD data for testing
    const testXml = global.usejsdom(customizationXML)
    const attList = testXml.querySelector('elementSpec[ident="title"] attList')
    attList.parentNode.removeChild(attList)
    const testXmlString = testXml.documentElement.outerHTML

    // Update JSON data accordingly
    customJson.elements = customJson.elements.map(el => {
      if (el.ident === 'title') {
        el.attributes = []
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
      type: 'CHANGE_ELEMENT_ATTRIBUTE',
      element: 'title',
      attName: 'level'
    })
    const secondState = romajsApp(firstState, {
      type: 'SET_VALLIST_TYPE',
      member: 'title',
      memberType: 'element',
      attr: 'level',
      listType: 'semi'
    })
    const state = romajsApp(secondState, {
      type: 'UPDATE_CUSTOMIZATION_ODD'
    })
    let xml = parser.parseFromString(state.odd.customization.updatedXml)
    xml = global.usejsdom(xml)
    expect(xml.querySelector('elementSpec[ident="title"] > attList > attDef[ident="level"] > valList').getAttribute('type')).toEqual('semi')
  })

  it('should change the valList type of an attribute inherited from a class.', () => {
    customJson = JSON.parse(customization)
    localJson = JSON.parse(localsource)

    const firstState = romajsApp({
      odd: {
        customization: { isFetching: false, json: customJson, xml: customizationXMLString },
        localsource: { isFetching: false, json: localJson }
      },
      selectedOdd: ''
    }, {
      type: 'CHANGE_CLASS_ATTRIBUTE_ON_ELEMENT',
      element: 'title',
      className: 'att.canonical',
      attName: 'key'
    })
    const secondState = romajsApp(firstState, {
      type: 'SET_VALLIST_TYPE',
      member: 'title',
      memberType: 'element',
      attr: 'key',
      listType: 'semi'
    })
    const state = romajsApp(secondState, {
      type: 'UPDATE_CUSTOMIZATION_ODD'
    })
    let xml = parser.parseFromString(state.odd.customization.updatedXml)
    xml = global.usejsdom(xml)
    expect(xml.querySelector('elementSpec[ident="title"] > attList > attDef[ident="key"] > valList').getAttribute('type')).toEqual('semi')
  })

  it('should add a valItem to a valList of an attribute inherited from a class.', () => {
    customJson = JSON.parse(customization)
    localJson = JSON.parse(localsource)

    const firstState = romajsApp({
      odd: {
        customization: { isFetching: false, json: customJson, xml: customizationXMLString },
        localsource: { isFetching: false, json: localJson }
      },
      selectedOdd: ''
    }, {
      type: 'CHANGE_CLASS_ATTRIBUTE_ON_ELEMENT',
      element: 'title',
      className: 'att.canonical',
      attName: 'key'
    })
    const secondState = romajsApp(firstState, {
      type: 'ADD_VALITEM',
      member: 'title',
      memberType: 'element',
      attr: 'key',
      value: 'new'
    })
    const state = romajsApp(secondState, {
      type: 'UPDATE_CUSTOMIZATION_ODD'
    })
    let xml = parser.parseFromString(state.odd.customization.updatedXml)
    xml = global.usejsdom(xml)
    expect(xml.querySelector('elementSpec[ident="title"] > attList > attDef[ident="key"] > valList > valItem').getAttribute('ident')).toEqual('new')
    expect(xml.querySelector('elementSpec[ident="title"] > attList > attDef[ident="key"] > valList > valItem').getAttribute('mode')).toEqual('add')
  })

  it('should remove a valItem from a valList of an attribute inherited from a class.', () => {
    customJson = JSON.parse(customization)
    localJson = JSON.parse(localsource)

    const firstState = romajsApp({
      odd: {
        customization: { isFetching: false, json: customJson, xml: customizationXMLString },
        localsource: { isFetching: false, json: localJson }
      },
      selectedOdd: ''
    }, {
      type: 'CHANGE_CLASS_ATTRIBUTE_ON_ELEMENT',
      element: 'title',
      className: 'att.typed',
      attName: 'type'
    })
    const secondState = romajsApp(firstState, {
      type: 'DELETE_VALITEM',
      member: 'title',
      memberType: 'element',
      attr: 'type',
      value: 'desc'
    })
    const state = romajsApp(secondState, {
      type: 'UPDATE_CUSTOMIZATION_ODD'
    })
    let xml = parser.parseFromString(state.odd.customization.updatedXml)
    xml = global.usejsdom(xml)
    expect(xml.querySelector('elementSpec[ident="title"] > attList > attDef[ident="type"] > valList > valItem[ident="desc"]').getAttribute('mode')).toEqual('delete')
  })

  it('should set a datatype for an element attribute inherited from a class.', () => {
    customJson = JSON.parse(customization)
    localJson = JSON.parse(localsource)

    const firstState = romajsApp({
      odd: {
        customization: { isFetching: false, json: customJson, xml: customizationXMLString },
        localsource: { isFetching: false, json: localJson }
      },
      selectedOdd: ''
    }, {
      type: 'CHANGE_CLASS_ATTRIBUTE_ON_ELEMENT',
      element: 'title',
      className: 'att.typed',
      attName: 'type'
    })
    const secondState = romajsApp(firstState, {
      type: 'SET_DATATYPE',
      member: 'title',
      memberType: 'element',
      attr: 'type',
      datatype: 'string'
    })
    const state = romajsApp(secondState, {
      type: 'UPDATE_CUSTOMIZATION_ODD'
    })
    let xml = parser.parseFromString(state.odd.customization.updatedXml)
    xml = global.usejsdom(xml)
    expect(xml.querySelector('elementSpec[ident="title"] > attList > attDef[ident="type"] > datatype > dataRef').getAttribute('name')).toEqual('string')
  })

  it('should set a restriction on a datatype for an element attribute inherited from a class.', () => {
    customJson = JSON.parse(customization)
    localJson = JSON.parse(localsource)

    const firstState = romajsApp({
      odd: {
        customization: { isFetching: false, json: customJson, xml: customizationXMLString },
        localsource: { isFetching: false, json: localJson }
      },
      selectedOdd: ''
    }, {
      type: 'CHANGE_CLASS_ATTRIBUTE_ON_ELEMENT',
      element: 'title',
      className: 'att.typed',
      attName: 'type'
    })
    const secondState = romajsApp(firstState, {
      type: 'SET_DATATYPE_RESTRICTION',
      member: 'title',
      memberType: 'element',
      attr: 'type',
      value: '[ab]'
    })
    const state = romajsApp(secondState, {
      type: 'UPDATE_CUSTOMIZATION_ODD'
    })
    let xml = parser.parseFromString(state.odd.customization.updatedXml)
    xml = global.usejsdom(xml)
    expect(xml.querySelector('elementSpec[ident="title"] > attList > attDef[ident="type"] > datatype > dataRef[key="teidata.enumerated"]').getAttribute('restriction')).toEqual('[ab]')
  })

  it('should make an element member of model class', () => {
    customJson = JSON.parse(customization)
    localJson = JSON.parse(localsource)

    const firstState = romajsApp({
      odd: {
        customization: { isFetching: false, json: customJson, xml: customizationXMLString },
        localsource: { isFetching: false, json: localJson }
      },
      selectedOdd: ''
    }, {
      type: 'ADD_ELEMENT_MODEL_CLASS',
      element: 'div',
      className: 'model.pLike'
    })
    const state = romajsApp(firstState, {
      type: 'UPDATE_CUSTOMIZATION_ODD'
    })
    let xml = parser.parseFromString(state.odd.customization.updatedXml)
    xml = global.usejsdom(xml)
    expect(xml.querySelector('elementSpec[ident="div"] > classes > memberOf').getAttribute('key')).toEqual('model.pLike')
  })

  it('should remove an element from a model class', () => {
    customJson = JSON.parse(customization)
    localJson = JSON.parse(localsource)

    const firstState = romajsApp({
      odd: {
        customization: { isFetching: false, json: customJson, xml: customizationXMLString },
        localsource: { isFetching: false, json: localJson }
      },
      selectedOdd: ''
    }, {
      type: 'DELETE_ELEMENT_MODEL_CLASS',
      element: 'div',
      className: 'model.divLike'
    })
    const state = romajsApp(firstState, {
      type: 'UPDATE_CUSTOMIZATION_ODD'
    })
    let xml = parser.parseFromString(state.odd.customization.updatedXml)
    xml = global.usejsdom(xml)
    expect(xml.querySelector('elementSpec[ident="div"] > classes > memberOf[key="model.divLike"]').getAttribute('mode')).toEqual('delete')
  })

  it('should update element\'s content model', () => {
    customJson = JSON.parse(customization)
    localJson = JSON.parse(localsource)

    const firstState = romajsApp({
      odd: {
        customization: { isFetching: false, json: customJson, xml: customizationXMLString },
        localsource: { isFetching: false, json: localJson }
      },
      selectedOdd: ''
    }, {
      type: 'UPDATE_CONTENT_MODEL',
      element: 'title',
      content: [
        {
          key: 'macro.phraseSeq.limited',
          type: 'macroRef'
        },
        {
          minOccurs: '2',
          maxOccurs: '234',
          content: [
            {
              key: 'abbr',
              type: 'elementRef'
            }
          ],
          type: 'alternate'
        }
      ]
    })
    const state = romajsApp(firstState, {
      type: 'UPDATE_CUSTOMIZATION_ODD'
    })
    let xml = parser.parseFromString(state.odd.customization.updatedXml)
    xml = global.usejsdom(xml)
    expect(xml.querySelector('elementSpec[ident="title"] > content > macroRef').getAttribute('key')).toEqual('macro.phraseSeq.limited')
    expect(xml.querySelector('elementSpec[ident="title"] > content > alternate').getAttribute('minOccurs')).toEqual('2')
    expect(xml.querySelector('elementSpec[ident="title"] > content > alternate').getAttribute('maxOccurs')).toEqual('234')
    expect(xml.querySelector('elementSpec[ident="title"] > content > alternate > elementRef').getAttribute('key')).toEqual('abbr')
  })

  it('should create a new element', () => {
    customJson = JSON.parse(customization)
    localJson = JSON.parse(localsource)

    // Update JSON data directly
    customJson.elements.push({
      ident: 'newElement',
      type: 'elements',
      module: 'core',
      desc: [ '<desc xmlns="http://tei-c.org/ns/1.0" xml:lang="en">New Element Desc</desc>' ],
      shortDesc: '',
      gloss: [],
      altIdent: ['newEl'],
      classes: {
        model: [
          'model.biblLike'
        ],
        atts: []
      },
      attributes: [
        {
          ident: 'newAttribute',
          desc: ['<desc xmlns="http://tei-c.org/ns/1.0" xml:lang="en">sdf</desc>'],
          gloss: [],
          altIdent: ['now'],
          datatype: {
            dataRef: {
              name: 'string',
              dataFacet: [],
              restriction: '[ba]'
            }
          },
          valDesc: ['<valDesc xmlns="http://tei-c.org/ns/1.0" xml:lang="en">afsfg</valDesc>'],
          mode: 'add',
          ns: 'http://example.com/newNS',
          usage: 'req',
          _isNew: true,
          valList: {
            type: 'semi',
            valItem: [
              {
                ident: 'a'
              }
            ]
          }
        }
      ],
      content: [
        {
          key: 'ab',
          type: 'elementRef'
        }
      ],
      ns: 'http://example.com/ns',
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
    xml = global.usejsdom(xml)
    const elSpec = xml.querySelector('elementSpec[ident="newElement"]')
    // console.log(elSpec.outerHTML)
    expect(elSpec).toExist()
    expect(elSpec.getAttribute('ident')).toEqual('newElement')
    expect(elSpec.getAttribute('ns')).toEqual('http://example.com/ns')
    expect(elSpec.querySelector('desc').textContent).toEqual('New Element Desc')
    expect(elSpec.querySelector('altIdent').textContent).toEqual('newEl')
    expect(elSpec.querySelector('classes > memberOf').getAttribute('key')).toEqual('model.biblLike')
    expect(elSpec.querySelector('valList').getAttribute('type')).toEqual('semi')
    expect(elSpec.querySelector('attDef > valDesc').textContent).toEqual('afsfg')
    expect(elSpec.querySelector('attDef > datatype > dataRef').getAttribute('name')).toEqual('string')
    expect(elSpec.querySelector('attDef > datatype > dataRef').getAttribute('restriction')).toEqual('[ba]')
  })

  it('should handle apply changes to ODD settings (metadata)', () => {
    customJson = JSON.parse(customization)
    localJson = JSON.parse(localsource)

    customJson.title = 'a title'
    customJson.author = 'an author'
    customJson.filename = 'tei_test'
    customJson.prefix = 'tei_'
    customJson.targetLang = 'it'
    customJson.docLang = 'it'

    const firstState = romajsApp({
      odd: {
        customization: { isFetching: false, json: customJson, xml: customizationXMLString },
        localsource: { isFetching: false, json: localJson }
      },
      selectedOdd: ''
    }, {
      type: 'APPLY_ODD_SETTINGS'
    })

    const state = romajsApp(firstState, {
      type: 'UPDATE_CUSTOMIZATION_ODD'
    })
    let xml = parser.parseFromString(state.odd.customization.updatedXml)
    xml = global.usejsdom(xml)
    const titleStmt = xml.querySelector('fileDesc titleStmt')
    const schemaSpec = xml.querySelector('schemaSpec')
    expect(titleStmt.querySelector('title').textContent).toEqual('a title')
    expect(titleStmt.querySelector('author').textContent).toEqual('an author')
    expect(schemaSpec.getAttribute('ident')).toEqual('tei_test')
    expect(schemaSpec.getAttribute('prefix')).toEqual('tei_')
    expect(schemaSpec.getAttribute('targetLang')).toEqual('it')
    expect(schemaSpec.getAttribute('docLang')).toEqual('it')
  })

  it('should change the desc of an attribute value on an element.', () => {
    customJson = JSON.parse(customization)
    localJson = JSON.parse(localsource)

    const firstState = romajsApp({
      odd: {
        customization: { isFetching: false, json: customJson, xml: customizationXMLString },
        localsource: { isFetching: false, json: localJson }
      },
      selectedOdd: ''
    }, {
      type: 'UPDATE_ATTRIBUTE_DOCS',
      member: 'list',
      memberType: 'element',
      attr: 'type',
      docEl: 'desc',
      content: `<desc>!!!</desc>`,
      index: 0,
      valItem: 'gloss'
    })
    const state = romajsApp(firstState, {
      type: 'UPDATE_CUSTOMIZATION_ODD'
    })
    let xml = parser.parseFromString(state.odd.customization.updatedXml)
    xml = global.usejsdom(xml)
    expect(xml.querySelector('elementSpec[ident="list"] > attList > attDef[ident="type"] valItem[ident="gloss"] > desc').textContent).toEqual('!!!')
  })

  it('should change the desc of an inherited attribute value on an element.', () => {
    customJson = JSON.parse(customization)
    localJson = JSON.parse(localsource)

    const firstState = romajsApp({
      odd: {
        customization: { isFetching: false, json: customJson, xml: customizationXMLString },
        localsource: { isFetching: false, json: localJson }
      },
      selectedOdd: ''
    }, {
      type: 'CHANGE_CLASS_ATTRIBUTE_ON_ELEMENT',
      element: 'div',
      className: 'att.typed',
      attName: 'type'
    })
    const secondState = romajsApp(firstState, {
      type: 'ADD_VALITEM',
      member: 'div',
      memberType: 'element',
      attr: 'type',
      value: 'chapter'
    })
    const thirdState = romajsApp(secondState, {
      type: 'UPDATE_ATTRIBUTE_DOCS',
      member: 'div',
      memberType: 'element',
      attr: 'type',
      docEl: 'desc',
      content: `<desc>!!!</desc>`,
      index: 0,
      valItem: 'chapter'
    })
    const state = romajsApp(thirdState, {
      type: 'UPDATE_CUSTOMIZATION_ODD'
    })
    let xml = parser.parseFromString(state.odd.customization.updatedXml)
    xml = global.usejsdom(xml)
    expect(xml.querySelector('elementSpec[ident="div"] > attList > attDef[ident="type"] > valList > valItem > desc').textContent).toEqual('!!!')
  })
})
