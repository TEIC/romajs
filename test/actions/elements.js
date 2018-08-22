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

  it('addElementAttribute should add a new attribute with a different namespace to an element', () => {
    expect(actions.addElementAttribute('div', 'newAtt')).toEqual({
      type: 'ADD_ELEMENT_ATTRIBUTE',
      element: 'div',
      attribute: 'newAtt'
    })
  })

  it('deleteElementAttribute should delete an attribute defined directly on an element', () =>{
    expect(actions.deleteElementAttribute('title', 'type')).toEqual({
      type: 'DELETE_ELEMENT_ATTRIBUTE',
      element: 'title',
      attribute: 'type'
    })
  })

  it('addElementAttributeClass should add an element\'s membership to an attribute class', () => {
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

  it('restoreElementAttributeClass should add an element\'s membership to an attribute class', () =>{
    expect(actions.restoreElementAttributeClass('div', 'att.global.rendition', [])).toEqual({
      type: 'RESTORE_ELEMENT_ATTRIBUTE_CLASS',
      element: 'div',
      deletedAttributes: [],
      className: 'att.global.rendition'
    })
  })

  it('deleteClassAttribute should delete an attribute from a class on an element', () =>{
    expect(actions.deleteClassAttribute('div', 'att.global.rendition', 'rend')).toEqual({
      type: 'DELETE_CLASS_ATTRIBUTE',
      element: 'div',
      className: 'att.global.rendition',
      attName: 'rend'
    })
  })

  it('restoreClassAttribute should restore an attribute from a class on an element', () =>{
    expect(actions.restoreClassAttribute('div', 'rend')).toEqual({
      type: 'RESTORE_CLASS_ATTRIBUTE',
      element: 'div',
      attName: 'rend'
    })
  })

  it('changeClassAttribute should prepare an attribute from a class on an element to be changed', () =>{
    expect(actions.changeClassAttribute('div', 'att.global.rendition', 'rend')).toEqual({
      type: 'CHANGE_CLASS_ATTRIBUTE',
      element: 'div',
      className: 'att.global.rendition',
      attName: 'rend'
    })
  })

  // Add test for RESTORE_ELEMENT_ATTRIBUTE and a couple more!
})
