import {
  SELECT_ODD, REQUEST_ODD, RECEIVE_ODD, REQUEST_LOCAL_SOURCE, RECEIVE_LOCAL_SOURCE,
  REQUEST_OXGARAGE_TRANSFORM, RECEIVE_FROM_OXGARAGE, UPDATE_CUSTOMIZATION_ODD, EXPORT_ODD
} from '../actions'
import {
  INCLUDE_MODULES, EXCLUDE_MODULES, INCLUDE_ELEMENTS, EXCLUDE_ELEMENTS
} from '../actions/modules'
import {
  UPDATE_ELEMENT_DOCS, ELEMENT_ADD_MEMBEROF, ELEMENT_REMOVE_MEMBEROF
} from '../actions/elements'
import { oddModules } from './modules'
import { oddElements } from './elements'
import { updateOdd } from './updateOdd'
import { ui } from  './interface'
import { combineReducers } from 'redux'
import * as fileSaver from 'file-saver'
import { routerReducer } from 'react-router-redux'

function selectedOdd(state = '', action) {
  switch (action.type) {
    case SELECT_ODD:
      return action.oddUrl
    default:
      return state
  }
}

function localSource(state = {
  isFetching: false
}, action) {
  switch (action.type) {
    case REQUEST_LOCAL_SOURCE:
      return Object.assign({}, state, {
        isFetching: true
      })
    case RECEIVE_LOCAL_SOURCE:
      return Object.assign({}, state, {
        isFetching: false,
        json: action.json,
        lastUpdated: action.receivedAt
      })
    default:
      return state
  }
}

function customization(state = {
  isFetching: false
}, action) {
  switch (action.type) {
    case REQUEST_ODD:
      return Object.assign({}, state, {
        isFetching: true
      })
    case RECEIVE_ODD:
      return Object.assign({}, state, {
        isFetching: false,
        xml: action.xml,
        lastUpdated: Date.now()
      })
    case REQUEST_OXGARAGE_TRANSFORM:
      return Object.assign({}, state, {
        isFetching: true
      })
    case RECEIVE_FROM_OXGARAGE:
      return Object.assign({}, state, {
        isFetching: false,
        json: action.json,
        receivedAt: action.receivedAt
      })
    default:
      return state
  }
}

function odd(state = {}, action) {
  switch (action.type) {
    case UPDATE_CUSTOMIZATION_ODD:
      const xml = Object.assign({}, state.customization,
        {
          xml: updateOdd(state.localsource, state.customization),
          lastUpdated: Date.now()
        })
      return Object.assign({}, state, {customization: xml})
    case EXPORT_ODD:
      fileSaver.saveAs(new Blob([state.customization.xml], {'type': 'text\/xml'}), 'new_odd.xml')
      return state
    case RECEIVE_LOCAL_SOURCE:
    case REQUEST_LOCAL_SOURCE:
      return Object.assign({}, state,
        {localsource: localSource(state.localsource, action)}
      )
    case REQUEST_ODD:
    case RECEIVE_ODD:
    case REQUEST_OXGARAGE_TRANSFORM:
    case RECEIVE_FROM_OXGARAGE:
      return Object.assign({}, state,
        {customization: customization(state.customization, action)}
      )
    case INCLUDE_MODULES:
    case EXCLUDE_MODULES:
    case INCLUDE_ELEMENTS:
    case EXCLUDE_ELEMENTS:
      return Object.assign({}, oddModules(state, action))
    case UPDATE_ELEMENT_DOCS:
    case ELEMENT_ADD_MEMBEROF:
    case ELEMENT_REMOVE_MEMBEROF:
      return Object.assign({}, oddElements(state, action))
    default:
      return state
  }
}

const romajsApp = combineReducers({
  selectedOdd,
  odd,
  ui,
  router: routerReducer
})

export default romajsApp
