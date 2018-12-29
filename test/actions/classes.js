import expect from 'expect'
import * as actions from '../../src/actions/classes'

describe('Class actions (lol)', () => {
  it('updateClassDocs should pass documentation element changes to a classSpec', () =>{
    expect(actions.updateClassDocs('att.ascribed', 'desc', 'new desc', 0)).toEqual({
      type: 'UPDATE_CLASS_DOCS',
      member: 'att.ascribed',
      docEl: 'desc',
      content: 'new desc',
      index: 0
    })
  })

  it('deleteClassDocs should delete a class\'s documentation element', () =>{
    expect(actions.deleteClassDocs('att.ascribed', 'altId', 1)).toEqual({
      type: 'DELETE_CLASS_DOCS',
      member: 'att.ascribed',
      docEl: 'altId',
      index: 1
    })
  })
})
