import expect from 'expect'
import * as actions from '../../src/actions/modules'

describe('Module actions', () => {
  it('includeModules should pass a list of modules to include in the customization', () =>{
    expect(actions.includeModules(['analysis'])).toEqual({
      type: 'INCLUDE_MODULES',
      modules: ['analysis']
    })
  })
  it('excludeModules should pass a list of modules to exclude from the customization', () =>{
    expect(actions.excludeModules(['header'])).toEqual({
      type: 'EXCLUDE_MODULES',
      modules: ['header']
    })
  })
  it('includeElements should pass a list of elements to include in a module', () =>{
    expect(actions.includeElements(['p'])).toEqual({
      type: 'INCLUDE_ELEMENTS',
      elements: ['p']
    })
  })
  it('excludeElements should pass a list of elements to exclude from a module', () =>{
    expect(actions.excludeElements(['p'])).toEqual({
      type: 'EXCLUDE_ELEMENTS',
      elements: ['p']
    })
  })
})
