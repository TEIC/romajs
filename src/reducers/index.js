import {
  SELECT_ODD, REQUEST_ODD, RECEIVE_ODD, REQUEST_LOCAL_SOURCE, RECEIVE_LOCAL_SOURCE,
  REQUEST_OXGARAGE_TRANSFORM, RECEIVE_FROM_OXGARAGE, UPDATE_CUSTOMIZATION_ODD, EXPORT_ODD, EXPORT_SCHEMA, CLEAR_STATE,
  REPORT_ERROR
} from '../actions'
import {
  INCLUDE_MODULES, EXCLUDE_MODULES, INCLUDE_ELEMENTS, EXCLUDE_ELEMENTS, INCLUDE_CLASSES, EXCLUDE_CLASSES,
  INCLUDE_DATATYPES, EXCLUDE_DATATYPES
} from '../actions/modules'
import {
  DELETE_ELEMENT_DOCS, UPDATE_ELEMENT_DOCS, ADD_ELEMENT_MODEL_CLASS, DELETE_ELEMENT_MODEL_CLASS,
  ADD_ELEMENT_ATTRIBUTE, DELETE_ELEMENT_ATTRIBUTE, RESTORE_ELEMENT_ATTRIBUTE, CHANGE_ELEMENT_ATTRIBUTE,
  ADD_ELEMENT_ATTRIBUTE_CLASS, RESTORE_ELEMENT_ATTRIBUTE_CLASS, DELETE_ELEMENT_ATTRIBUTE_CLASS,
  RESTORE_CLASS_ATTRIBUTE_ON_ELEMENT, RESTORE_CLASS_ATTRIBUTE_DELETED_ON_CLASS,
  USE_CLASS_DEFAULT, DELETE_CLASS_ATTRIBUTE_ON_ELEMENT, CHANGE_CLASS_ATTRIBUTE_ON_ELEMENT, UPDATE_CONTENT_MODEL,
  RESTORE_ELEMENT_MEMBERSHIPS_TO_CLASS, CLEAR_ELEMENT_MEMBERSHIPS_TO_CLASS, CREATE_NEW_ELEMENT,
  DISCARD_ELEMENT_CHANGES, REVERT_ELEMENT_TO_SOURCE
} from '../actions/elements'
import {
  DELETE_ATTRIBUTE_DOCS, UPDATE_ATTRIBUTE_DOCS, SET_NS, SET_USAGE, SET_VALLIST_TYPE, ADD_VALITEM, DELETE_VALITEM,
  SET_DATATYPE, SET_DATATYPE_RESTRICTION
} from '../actions/attributes'
import { DELETE_CLASS_DOCS, UPDATE_CLASS_DOCS, DELETE_CLASS_ATTRIBUTE, RESTORE_CLASS_ATTRIBUTE, ADD_CLASS_ATTRIBUTE,
  ADD_MEMBERSHIP_TO_CLASS, REMOVE_MEMBERSHIP_TO_CLASS, CHANGE_CLASS_ATTRIBUTE,
  RESTORE_MEMBERSHIPS_TO_CLASS, CLEAR_MEMBERSHIPS_TO_CLASS, CREATE_NEW_CLASS, DISCARD_CLASS_CHANGES,
  REVERT_CLASS_TO_SOURCE } from '../actions/classes'
import { UPDATE_DATATYPE_DOCS, DELETE_DATATYPE_DOCS, CREATE_NEW_DATATYPE, DISCARD_DATATYPE_CHANGES, REVERT_DATATYPE_TO_SOURCE,
  SET_DATAREF, SET_DATAREF_RESTRICTION, NEW_DATAREF, DELETE_DATATYPE_CONTENT, MOVE_DATATYPE_CONTENT, NEW_TEXTNODE, NEW_DATATYPE_VALLIST, ADD_DATATYPE_VALITEM, DELETE_DATATYPE_VALITEM, SET_DATATYPE_CONTENT_GROUPING } from '../actions/datatypes'
import { oddModules } from './modules'
import { oddElements } from './elements'
import { oddClasses } from './classes'
import { oddAttributes } from './attributes'
import { oddDatatypes } from './datatypes'
import { updateOdd } from './updateOdd'
import { ui } from  './interface'
import * as fileSaver from 'file-saver'
import { routerReducer } from 'react-router-redux'
import oxgarage from '../utils/oxgarage'

import { clone } from '../utils/clone'

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
        orig: clone(action.json),
        receivedAt: action.receivedAt
      })
    default:
      return state
  }
}

function odd(state = {}, action) {
  switch (action.type) {
    case CLEAR_STATE:
      return {}
    case UPDATE_CUSTOMIZATION_ODD:
      const xml = Object.assign({}, state.customization,
        {
          updatedXml: updateOdd(state.localsource, state.customization),
          lastUpdated: Date.now()
        })
      return Object.assign({}, state, {customization: xml})
    case EXPORT_ODD:
      const toExport = state.customization.updatedXml ? state.customization.updatedXml : state.customization.xml
      fileSaver.saveAs(new Blob([toExport], {'type': 'text\/xml'}), 'new_odd.xml')
      return state
    case EXPORT_SCHEMA:
      postToOxGarage(state.customization.updatedXml, oxgarage.compile).then((compiled) => {
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
    case INCLUDE_CLASSES:
    case EXCLUDE_CLASSES:
    case INCLUDE_DATATYPES:
    case EXCLUDE_DATATYPES:
      return Object.assign({}, oddModules(state, action))
    case DELETE_ELEMENT_DOCS:
    case UPDATE_ELEMENT_DOCS:
    case ADD_ELEMENT_MODEL_CLASS:
    case DELETE_ELEMENT_MODEL_CLASS:
    case ADD_ELEMENT_ATTRIBUTE:
    case DELETE_ELEMENT_ATTRIBUTE:
    case RESTORE_ELEMENT_ATTRIBUTE:
    case CHANGE_ELEMENT_ATTRIBUTE:
    case ADD_ELEMENT_ATTRIBUTE_CLASS:
    case RESTORE_ELEMENT_ATTRIBUTE_CLASS:
    case DELETE_ELEMENT_ATTRIBUTE_CLASS:
    case RESTORE_CLASS_ATTRIBUTE_ON_ELEMENT:
    case RESTORE_CLASS_ATTRIBUTE_DELETED_ON_CLASS:
    case USE_CLASS_DEFAULT:
    case DELETE_CLASS_ATTRIBUTE_ON_ELEMENT:
    case CHANGE_CLASS_ATTRIBUTE_ON_ELEMENT:
    case UPDATE_CONTENT_MODEL:
    case RESTORE_ELEMENT_MEMBERSHIPS_TO_CLASS:
    case CLEAR_ELEMENT_MEMBERSHIPS_TO_CLASS:
    case CREATE_NEW_ELEMENT:
    case DISCARD_ELEMENT_CHANGES:
    case REVERT_ELEMENT_TO_SOURCE:
      return Object.assign({}, oddElements(state, action))
    case DELETE_CLASS_DOCS:
    case UPDATE_CLASS_DOCS:
    case DELETE_CLASS_ATTRIBUTE:
    case RESTORE_CLASS_ATTRIBUTE:
    case ADD_CLASS_ATTRIBUTE:
    case ADD_MEMBERSHIP_TO_CLASS:
    case REMOVE_MEMBERSHIP_TO_CLASS:
    case CHANGE_CLASS_ATTRIBUTE:
    case RESTORE_MEMBERSHIPS_TO_CLASS:
    case CLEAR_MEMBERSHIPS_TO_CLASS:
    case CREATE_NEW_CLASS:
    case DISCARD_CLASS_CHANGES:
    case REVERT_CLASS_TO_SOURCE:
      return Object.assign({}, oddClasses(state, action))
    case UPDATE_ATTRIBUTE_DOCS:
    case DELETE_ATTRIBUTE_DOCS:
    case SET_NS:
    case SET_USAGE:
    case SET_VALLIST_TYPE:
    case ADD_VALITEM:
    case DELETE_VALITEM:
    case SET_DATATYPE:
    case SET_DATATYPE_RESTRICTION:
      return Object.assign({}, oddAttributes(state, action))
    case UPDATE_DATATYPE_DOCS:
    case DELETE_DATATYPE_DOCS:
    case CREATE_NEW_DATATYPE:
    case DISCARD_DATATYPE_CHANGES:
    case REVERT_DATATYPE_TO_SOURCE:
    case SET_DATAREF:
    case SET_DATAREF_RESTRICTION:
    case NEW_DATAREF:
    case NEW_TEXTNODE:
    case NEW_DATATYPE_VALLIST:
    case DELETE_DATATYPE_CONTENT:
    case MOVE_DATATYPE_CONTENT:
    case ADD_DATATYPE_VALITEM:
    case DELETE_DATATYPE_VALITEM:
    case SET_DATATYPE_CONTENT_GROUPING:
      return Object.assign({}, oddDatatypes(state, action))
    case REPORT_ERROR:
      return Object.assign({}, {error: action.err})
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
