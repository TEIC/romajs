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
})
