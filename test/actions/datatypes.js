import expect from 'expect'
import * as actions from '../../src/actions/datatypes'

describe('Datatype actions', () => {
  it('updateDatatypeDocs should pass documentation element changes to a dataSpec', () =>{
    expect(actions.updateDatatypeDocs('teidata.certainty', 'desc', 'new desc', 0)).toEqual({
      type: 'UPDATE_DATATYPE_DOCS',
      member: 'teidata.certainty',
      docEl: 'desc',
      content: 'new desc',
      index: 0
    })
  })

  it('deleteDatatypeDocs should delete a datatype\'s documentation element', () =>{
    expect(actions.deleteDatatypeDocs('teidata.certainty', 'altId', 1)).toEqual({
      type: 'DELETE_DATATYPE_DOCS',
      member: 'teidata.certainty',
      docEl: 'altId',
      index: 1
    })
  })

  it('createNewDatatype should create a new datatype', () =>{
    expect(actions.createNewDatatype('teidata.newDt', 'tei')).toEqual({
      type: 'CREATE_NEW_DATATYPE',
      name: 'teidata.newDt',
      module: 'tei'
    })
  })

  it('discardChanges should discard any changes to this datatype', () =>{
    expect(actions.discardChanges('teidata.certainty')).toEqual({
      type: 'DISCARD_DATATYPE_CHANGES',
      name: 'teidata.certainty',
    })
  })

  it('revertToSource should discard any changes to this datatype', () =>{
    expect(actions.revertToSource('teidata.certainty')).toEqual({
      type: 'REVERT_DATATYPE_TO_SOURCE',
      name: 'teidata.certainty'
    })
  })

  it('setDataRef should set the key or name of a DataRef at a given index for a given datatype', () =>{
    expect(actions.setDataRef('teidata.enumerated', 'anyURI', 0)).toEqual({
      type: 'SET_DATAREF',
      datatype: 'teidata.enumerated',
      keyOrName: 'anyURI',
      index: 0
    })
  })

  it('setDataRefRestriction should change a restriction for a dataRef in this datatype\'s content', () =>{
    expect(actions.setDataRefRestriction('teidata.enumerated', 'teidata.word', '[0-9]', 0)).toEqual({
      type: 'SET_DATAREF_RESTRICTION',
      datatype: 'teidata.enumerated',
      keyOrName: 'teidata.word',
      value: '[0-9]',
      index: 0
    })
  })

  it('newDataRef should create a new dataRef for a given datatype', () =>{
    expect(actions.newDataRef('teidata.enumerated')).toEqual({
      type: 'NEW_DATAREF',
      datatype: 'teidata.enumerated'
    })
  })

  it('newTextNode should create a new textNode for a given datatype', () =>{
    expect(actions.newTextNode('teidata.enumerated')).toEqual({
      type: 'NEW_TEXTNODE',
      datatype: 'teidata.enumerated'
    })
  })

  it('newDatatypeValList should create a new valList for a given datatype', () =>{
    expect(actions.newDatatypeValList('teidata.enumerated')).toEqual({
      type: 'NEW_DATATYPE_VALLIST',
      datatype: 'teidata.enumerated'
    })
  })

  it('addDatatypeValList should create a new value for a valList at a given index for a given datatype', () =>{
    expect(actions.addDatatypeValItem('teidata.enumerated', 1, 'test')).toEqual({
      type: 'ADD_DATATYPE_VALITEM',
      datatype: 'teidata.enumerated',
      index: 1,
      value: 'test'
    })
  })

  it('deleteDatatypeValList should delete a value for a valList at a given index for a given datatype', () =>{
    expect(actions.deleteDatatypeValItem('teidata.enumerated', 1, 'test')).toEqual({
      type: 'DELETE_DATATYPE_VALITEM',
      datatype: 'teidata.enumerated',
      index: 1,
      value: 'test'
    })
  })

  it('deleteDatatypeContent should delete a dataRef at a given index for a given datatype', () =>{
    expect(actions.deleteDatatypeContent('teidata.enumerated', 0)).toEqual({
      type: 'DELETE_DATATYPE_CONTENT',
      datatype: 'teidata.enumerated',
      index: 0
    })
  })

  it('moveDatatypeContent should move a dataRef from a given index to another for a given datatype', () =>{
    expect(actions.moveDatatypeContent('teidata.enumerated', 0, 1)).toEqual({
      type: 'MOVE_DATATYPE_CONTENT',
      datatype: 'teidata.enumerated',
      indexFrom: 0,
      indexTo: 1
    })
  })

  it('setDatatypeContentGrouping should set a type of grouping for a given datatype\'s content', () =>{
    expect(actions.setDatatypeContentGrouping('teidata.enumerated', 'unordered')).toEqual({
      type: 'SET_DATATYPE_CONTENT_GROUPING',
      datatype: 'teidata.enumerated',
      groupingType: 'unordered'
    })
  })
})
