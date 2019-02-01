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

  it('deleteClassAttribute should delete an attribute on an attribute class', () =>{
    expect(actions.deleteClassAttribute('att.ascribed', 'who')).toEqual({
      type: 'DELETE_CLASS_ATTRIBUTE',
      member: 'att.ascribed',
      attribute: 'who'
    })
  })

  it('restoreClassAttribute should restore a delete attribute on an attribute class', () =>{
    expect(actions.restoreClassAttribute('att.ascribed', 'who')).toEqual({
      type: 'RESTORE_CLASS_ATTRIBUTE',
      member: 'att.ascribed',
      attribute: 'who'
    })
  })

  it('addClassAttribute should add a new attribute to an attribute class', () =>{
    expect(actions.addClassAttribute('att.ascribed', 'new')).toEqual({
      type: 'ADD_CLASS_ATTRIBUTE',
      member: 'att.ascribed',
      attribute: 'new'
    })
  })

  it('addMembershipToClass should make this class member of another (atts)', () =>{
    expect(actions.addMembershipToClass('att.ascribed', 'att.global', 'atts')).toEqual({
      type: 'ADD_MEMBERSHIP_TO_CLASS',
      member: 'att.ascribed',
      className: 'att.global',
      classType: 'atts'
    })
  })

  it('addMembershipToClass should make this class member of another (model)', () =>{
    expect(actions.addMembershipToClass('model.pLike', 'model.teiHeaderPart', 'model')).toEqual({
      type: 'ADD_MEMBERSHIP_TO_CLASS',
      member: 'model.pLike',
      className: 'model.teiHeaderPart',
      classType: 'model'
    })
  })

  it('removeMembershipToClass should make this class not a member of another (atts)', () =>{
    expect(actions.removeMembershipToClass('att.global', 'att.global.linking', 'atts')).toEqual({
      type: 'REMOVE_MEMBERSHIP_TO_CLASS',
      member: 'att.global',
      className: 'att.global.linking',
      classType: 'atts'
    })
  })

  it('removeMembershipToClass should make this class not a member of another (model)', () =>{
    expect(actions.removeMembershipToClass('model.pLike', 'model.pLike.front', 'model')).toEqual({
      type: 'REMOVE_MEMBERSHIP_TO_CLASS',
      member: 'model.pLike',
      className: 'model.pLike.front',
      classType: 'model'
    })
  })

  it('changeClassAttribute mark existing attribute on an attribute class as changed', () =>{
    expect(actions.changeClassAttribute('att.global', 'who')).toEqual({
      type: 'CHANGE_CLASS_ATTRIBUTE',
      className: 'att.global',
      attName: 'who'
    })
  })

  it('restoreMembershipsToClass should restore membership to a given class for all classes that are members in the localsource', () =>{
    expect(actions.restoreMembershipsToClass('att.global.analytic', 'attributes')).toEqual({
      type: 'RESTORE_MEMBERSHIPS_TO_CLASS',
      className: 'att.global.analytic',
      classType: 'attributes'
    })
  })

  it('clearMembershipsToClass should clear membership to a given class for all classes that are members in the localsource', () =>{
    expect(actions.clearMembershipsToClass('att.global.analytic', 'attributes')).toEqual({
      type: 'CLEAR_MEMBERSHIPS_TO_CLASS',
      className: 'att.global.analytic',
      classType: 'attributes'
    })
  })

  it('createNewClass should create a new class (attributes)', () =>{
    expect(actions.createNewClass('att.newClass', 'core', 'attributes')).toEqual({
      type: 'CREATE_NEW_CLASS',
      name: 'att.newClass',
      module: 'core',
      classType: 'attributes'
    })
  })

  it('createNewClass should create a new class (model)', () =>{
    expect(actions.createNewClass('model.newClass', 'core', 'models')).toEqual({
      type: 'CREATE_NEW_CLASS',
      name: 'model.newClass',
      module: 'core',
      classType: 'models'
    })
  })

  it('discardChanges should discard any changes to this class', () =>{
    expect(actions.discardChanges('att.global', 'attributes')).toEqual({
      type: 'DISCARD_CLASS_CHANGES',
      name: 'att.global',
      classType: 'attributes'
    })
  })

  it('revertToSource should discard any changes to this class', () =>{
    expect(actions.revertToSource('model.pLike', 'models')).toEqual({
      type: 'REVERT_CLASS_TO_SOURCE',
      name: 'model.pLike',
      classType: 'models'
    })
  })
})
