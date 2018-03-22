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
})
