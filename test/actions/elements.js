import expect from 'expect'
import * as actions from '../../src/actions/elements'

describe('Element actions', () => {
  it('updateElementDocs should pass documentation element changes to an elementSpec', () =>{
    expect(actions.updateElementDocs('p', 'desc', 'new desc', 0)).toEqual({
      type: 'UPDATE_ELEMENT_DOCS',
      element: 'p',
      docEl: 'desc',
      content: 'new desc',
      index: 0
    })
  })

  it('addElementModelClass should add an element\'s membership to a model class', () =>{
    expect(actions.addElementModelClass('div', 'model.pLike')).toEqual({
      type: 'ADD_ELEMENT_MODEL_CLASS',
      element: 'div',
      className: 'model.pLike'
    })
  })

  it('deleteElementModelClass should delete an element\'s membership to a model class', () =>{
    expect(actions.deleteElementModelClass('div', 'model.divLike')).toEqual({
      type: 'DELETE_ELEMENT_MODEL_CLASS',
      element: 'div',
      className: 'model.divLike'
    })
  })

  it('addElementAttributeClass should add an element\'s membership to an attribute class', () =>{
    expect(actions.addElementAttributeClass('div', 'att.fragmentable')).toEqual({
      type: 'ADD_ELEMENT_ATTRIBUTE_CLASS',
      element: 'div',
      className: 'att.fragmentable'
    })
  })

  it('deleteElementAttributeClass should delete an element\'s membership to an attribute class', () =>{
    expect(actions.deleteElementAttributeClass('div', 'att.written')).toEqual({
      type: 'DELETE_ELEMENT_ATTRIBUTE_CLASS',
      element: 'div',
      className: 'att.written'
    })
  })
})
