import {
  SELECT_ODD, REQUEST_ODD, RECEIVE_ODD, REQUEST_LOCAL_SOURCE, RECEIVE_LOCAL_SOURCE,
  REQUEST_OXGARAGE_TRANSFORM, RECEIVE_FROM_OXGARAGE, UPDATE_CUSTOMIZATION_ODD, EXPORT_ODD, EXPORT_SCHEMA
} from '../actions'
import {
  INCLUDE_MODULES, EXCLUDE_MODULES, INCLUDE_ELEMENTS, EXCLUDE_ELEMENTS
} from '../actions/modules'
import {
  DELETE_ELEMENT_DOCS, UPDATE_ELEMENT_DOCS, ADD_ELEMENT_MODEL_CLASS, DELETE_ELEMENT_MODEL_CLASS,
  ADD_ELEMENT_ATTRIBUTE_CLASS, RESTORE_ELEMENT_ATTRIBUTE_CLASS, DELETE_ELEMENT_ATTRIBUTE_CLASS,
  RESTORE_CLASS_ATTRIBUTE, RESTORE_CLASS_ATTRIBUTE_DELETED_ON_CLASS,
  USE_CLASS_DEFAULT, DELETE_CLASS_ATTRIBUTE, CHANGE_CLASS_ATTRIBUTE
} from '../actions/elements'
import {
  DELETE_ATTRIBUTE_DOCS, UPDATE_ATTRIBUTE_DOCS, SET_NS, SET_USAGE
} from '../actions/attributes'
import { oddModules } from './modules'
import { oddElements } from './elements'
import { oddAttributes } from './attributes'
import { updateOdd } from './updateOdd'
import { ui } from  './interface'
import * as fileSaver from 'file-saver'
import { routerReducer } from 'react-router-redux'
import oxgarage from '../utils/oxgarage'

// import { clone } from '../utils/clone'

export function postToOxGarage(input, endpoint) {
  const fd = new FormData()
  fd.append('fileToConvert', new Blob([input], {'type': 'application\/octet-stream'}), 'file.odd')
  return new Promise((res)=>{
    fetch(endpoint, {
      mode: 'cors',
      method: 'post',
      body: fd
    })
      .then(response => {
        res(response.text())
      })
  })
}

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
        unchanged: action.xml,
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
    case EXPORT_SCHEMA:
      postToOxGarage(state.customization.xml, oxgarage.compile).then((compiled) => {
        postToOxGarage(compiled, oxgarage[action.format])
          .then((res) => {
            fileSaver.saveAs(new Blob([res], {'type': 'text\/xml'}), 'schema.' + action.format)
          })
      })
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
    case DELETE_ELEMENT_DOCS:
    case UPDATE_ELEMENT_DOCS:
    case ADD_ELEMENT_MODEL_CLASS:
    case DELETE_ELEMENT_MODEL_CLASS:
    case ADD_ELEMENT_ATTRIBUTE_CLASS:
    case RESTORE_ELEMENT_ATTRIBUTE_CLASS:
    case DELETE_ELEMENT_ATTRIBUTE_CLASS:
    case RESTORE_CLASS_ATTRIBUTE:
    case RESTORE_CLASS_ATTRIBUTE_DELETED_ON_CLASS:
    case USE_CLASS_DEFAULT:
    case DELETE_CLASS_ATTRIBUTE:
    case CHANGE_CLASS_ATTRIBUTE:
      return Object.assign({}, oddElements(state, action))
    case UPDATE_ATTRIBUTE_DOCS:
    case DELETE_ATTRIBUTE_DOCS:
    case SET_NS:
    case SET_USAGE:
      return Object.assign({}, oddAttributes(state, action))
    default:
      return state
  }
}

const reducers = {
  selectedOdd,
  odd,
  ui,
  router: routerReducer
}

export default reducers
