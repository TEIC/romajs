import expect from 'expect'
import * as actions from '../../src/actions/attributes'

describe('Attribute actions', () => {
  it('updateAttributeDocs should pass documentation element changes to an attDef', () =>{
    expect(actions.updateAttributeDocs('list', 'element', 'type', 'desc', 'new desc', 0)).toEqual({
      type: 'UPDATE_ATTRIBUTE_DOCS',
      member: 'list',
      memberType: 'element',
      attr: 'type',
      docEl: 'desc',
      content: 'new desc',
      index: 0
    })
  })

  it('deleteAttributeDocs should pass documentation element changes to an attDef', () =>{
    expect(actions.deleteAttributeDocs('list', 'element', 'type', 'desc', 0)).toEqual({
      type: 'DELETE_ATTRIBUTE_DOCS',
      member: 'list',
      memberType: 'element',
      attr: 'type',
      docEl: 'desc',
      index: 0
    })
  })

  it('setNs should pass a new namespace URI to attDef', () =>{
    expect(actions.setNs('list', 'element', 'type', 'http://example.com/')).toEqual({
      type: 'SET_NS',
      member: 'list',
      memberType: 'element',
      attr: 'type',
      ns: 'http://example.com/'
    })
  })

  it('setUsage should pass a new usage value to attDef', () =>{
    expect(actions.setUsage('list', 'element', 'type', 'opt')).toEqual({
      type: 'SET_USAGE',
      member: 'list',
      memberType: 'element',
      attr: 'type',
      usage: 'opt'
    })
  })

  it('setValListType should pass a new type of list valList', () =>{
    expect(actions.setValListType('title', 'element', 'key', 'closed')).toEqual({
      type: 'SET_VALLIST_TYPE',
      member: 'title',
      memberType: 'element',
      attr: 'key',
      listType: 'closed'
    })
  })

  it('addValItem should pass a value for a new valItem', () =>{
    expect(actions.addValItem('title', 'element', 'type', 'special')).toEqual({
      type: 'ADD_VALITEM',
      member: 'title',
      memberType: 'element',
      attr: 'type',
      value: 'special'
    })
  })

  it('deleteValItem should pass a value for removing a valItem defining that value', () =>{
    expect(actions.deleteValItem('title', 'element', 'type', 'special')).toEqual({
      type: 'DELETE_VALITEM',
      member: 'title',
      memberType: 'element',
      attr: 'type',
      value: 'special'
    })
  })

  it('setDatatype should pass the name (ident) of a new datatype for an attribute', () =>{
    expect(actions.setDatatype('title', 'element', 'type', 'string')).toEqual({
      type: 'SET_DATATYPE',
      member: 'title',
      memberType: 'element',
      attr: 'type',
      datatype: 'string'
    })
  })

  it('setDatatypeRestriction should pass the pattern to restrict an existing datatype for an attribute', () =>{
    expect(actions.setDataTypeRestriction('title', 'element', 'type', '[ab]')).toEqual({
      type: 'SET_DATATYPE_RESTRICTION',
      member: 'title',
      memberType: 'element',
      attr: 'type',
      value: '[ab]'
    })
  })
})
