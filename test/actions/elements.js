import expect from 'expect'
import * as actions from '../../src/actions/elements'

describe('Element actions', () => {
  it('updateContentModel should update and elementSpec\'s content model', () =>{
    expect(actions.updateContentModel('p', [
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
    ])).toEqual({
      type: 'UPDATE_CONTENT_MODEL',
      element: 'p',
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
  })

  it('updateElementDocs should pass documentation element changes to an elementSpec', () =>{
    expect(actions.updateElementDocs('p', 'desc', 'new desc', 0)).toEqual({
      type: 'UPDATE_ELEMENT_DOCS',
      element: 'p',
      docEl: 'desc',
      content: 'new desc',
      index: 0
    })
  })

  it('deleteElementDocs should delete a documentation element from an elementSpec', () =>{
    expect(actions.deleteElementDocs('p', 'desc', 1)).toEqual({
      type: 'DELETE_ELEMENT_DOCS',
      element: 'p',
      docEl: 'desc',
      index: 1
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

  it('restoreElementAttribute should restore a delete attribute defined directly on an element', () =>{
    expect(actions.restoreElementAttribute('title', 'type')).toEqual({
      type: 'RESTORE_ELEMENT_ATTRIBUTE',
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
      type: 'DELETE_CLASS_ATTRIBUTE_ON_ELEMENT',
      element: 'div',
      className: 'att.global.rendition',
      attName: 'rend'
    })
  })

  it('restoreClassAttribute should restore an attribute from a class on an element', () =>{
    expect(actions.restoreClassAttribute('div', 'rend')).toEqual({
      type: 'RESTORE_CLASS_ATTRIBUTE_ON_ELEMENT',
      element: 'div',
      attName: 'rend'
    })
  })

  it('restoreClassAttributeDeletedOnClass should restore, for this element only, an attribute deleted on a class', () =>{
    expect(actions.restoreClassAttributeDeletedOnClass('div', 'att.global', 'n')).toEqual({
      type: 'RESTORE_CLASS_ATTRIBUTE_DELETED_ON_CLASS',
      element: 'div',
      className: 'att.global',
      attName: 'n'
    })
  })

  it('useClassDefault should remove changes to an attribute defined on a class, thus restoring the class default behavior.', () =>{
    expect(actions.useClassDefault('div', 'n')).toEqual({
      type: 'USE_CLASS_DEFAULT',
      element: 'div',
      attName: 'n'
    })
  })

  it('deleteClassAttribute should delete an attribute defined on a class for this element.', () =>{
    expect(actions.deleteClassAttribute('div', 'att.global', 'n')).toEqual({
      type: 'DELETE_CLASS_ATTRIBUTE_ON_ELEMENT',
      element: 'div',
      className: 'att.global',
      attName: 'n'
    })
  })

  it('changeElementAttribute should mark an attribute defined on an element as changed.', () =>{
    expect(actions.changeElementAttribute('title', 'level')).toEqual({
      type: 'CHANGE_ELEMENT_ATTRIBUTE',
      element: 'title',
      attName: 'level'
    })
  })

  it('changeClassAttribute should prepare an attribute from a class on an element to be changed', () =>{
    expect(actions.changeClassAttribute('div', 'att.global.rendition', 'rend')).toEqual({
      type: 'CHANGE_CLASS_ATTRIBUTE_ON_ELEMENT',
      element: 'div',
      className: 'att.global.rendition',
      attName: 'rend'
    })
  })

  it('createNewElement should create a new element', () =>{
    expect(actions.createNewElement('newElement', 'core', 'http://example.com/ns')).toEqual({
      type: 'CREATE_NEW_ELEMENT',
      name: 'newElement',
      module: 'core',
      ns: 'http://example.com/ns'
    })
  })

  it('discardChanges should discard any changes to this element', () =>{
    expect(actions.discardChanges('div')).toEqual({
      type: 'DISCARD_ELEMENT_CHANGES',
      name: 'div'
    })
  })

  it('revertToSource should discard any changes to this element', () =>{
    expect(actions.revertToSource('div')).toEqual({
      type: 'REVERT_ELEMENT_TO_SOURCE',
      name: 'div'
    })
  })
})
