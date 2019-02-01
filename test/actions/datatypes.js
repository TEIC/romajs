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
})
