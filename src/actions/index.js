import fetch from 'isomorphic-fetch'

export const REQUEST_ODD = 'REQUEST_ODD'
export const RECEIVE_ODD = 'RECEIVE_ODD'
export const SELECT_ODD = 'SELECT_ODD'
export const REQUEST_LOCAL_SOURCE = 'REQUEST_LOCAL_SOURCE'
export const RECEIVE_LOCAL_SOURCE = 'RECEIVE_LOCAL_SOURCE'
export const REQUEST_ODD_JSON = 'REQUEST_ODD_JSON'
export const RECEIVE_ODD_JSON = 'RECEIVE_ODD_JSON'

export const UPDATE_CUSTOMIZATION_ODD = 'UPDATE_CUSTOMIZATION_ODD'
export const EXPORT_ODD = 'EXPORT_ODD'
export const EXPORT_SCHEMA = 'EXPORT_SCHEMA'

export const CLEAR_STATE = 'CLEAR_STATE'

export const REPORT_ERROR = 'REPORT_ERROR'

export function reportError(err) {
  return {
    type: REPORT_ERROR,
    err
  }
}

export function clearState() {
  return {
    type: CLEAR_STATE
  }
}

export function selectOdd(oddUrl) {
  return {
    type: SELECT_ODD,
    oddUrl
  }
}

function requestOdd(odd) {
  return {
    type: REQUEST_ODD,
    odd
  }
}

export function receiveOdd(string) {
  return {
    type: RECEIVE_ODD,
    xml: string,
    receivedAt: Date.now()
  }
}

function requestLocalSource(url) {
  return {
    type: REQUEST_LOCAL_SOURCE,
    url
  }
}

export function receiveLocalSource(json) {
  return {
    type: RECEIVE_LOCAL_SOURCE,
    json,
    receivedAt: Date.now()
  }
}

export function receiveOddJson(json) {
  return {
    type: RECEIVE_ODD_JSON,
    json,
    receivedAt: Date.now()
  }
}

export function requestOddJson() {
  return {
    type: REQUEST_ODD_JSON
  }
}

export function updateCustomizationOdd() {
  return {
    type: UPDATE_CUSTOMIZATION_ODD
  }
}

export function exportOdd() {
  return {
    type: EXPORT_ODD
  }
}

export function exportSchema(format) {
  return {
    type: EXPORT_SCHEMA,
    format
  }
}

/** ********
 * thunks *
 ******** **/

const isBrowser = typeof window !== 'undefined'
const fetchRetry = (url, n, errorMsg) => fetch(url).catch(function(err) {
  if (n === 1) {
    const msg = errorMsg ? errorMsg : err
    if (isBrowser) window.onerror(msg)
    throw msg
  }
  return fetchRetry(url, n - 1)
})

export function fetchOdd(odd) {
  return dispatch => {
    dispatch(requestOdd(odd))
    const errMsg = 'Failed to fetch ODD data'
    return new Promise((res)=>{
      fetchRetry(odd, 10, errMsg)
        .then(response => {
          if (!response.ok) {
            if (isBrowser) window.onerror(errMsg)
            throw Error(errMsg)
          }
          return response.text()
        })
        .then((xml) => {
          res(dispatch(receiveOdd(xml)))
        })
    })
  }
}

export function fetchKnownCustomization(url) {
  return dispatch => {
    dispatch(requestOddJson())
    const errMsg = 'Failed to fetch known ODD customization'
    return fetchRetry(url, 10, errMsg)
      .then(response => {
        if (!response.ok) {
          if (isBrowser) window.onerror(errMsg)
          throw Error(errMsg)
        }
        return response.json()
      })
      .then(json => dispatch(receiveOddJson(json)))
  }
}

export function fetchLocalSource(url) {
  return dispatch => {
    dispatch(requestLocalSource(url))
    const errMsg = 'Failed to fetch source data'
    return fetchRetry(url, 10, errMsg)
      .then(response => {
        if (!response.ok) {
          if (isBrowser) window.onerror(errMsg)
          throw Error(errMsg)
        }
        return response.json()
      })
      .then(json => dispatch(receiveLocalSource(json)))
  }
}

export function compileWithOxGarage(input, endpoint) {
  return dispatch => {
    dispatch(requestOdd())
    const fd = new FormData()
    fd.append('fileToConvert', new Blob([input], {'type': 'application\/octet-stream'}), 'file.odd')
    return new Promise((res)=>{
      fetch(endpoint, {
        mode: 'cors',
        method: 'post',
        body: fd
      })
        .then(response => response.text())
        .then((data) => {
          return res(data)
        })
        .catch( (err) => {
          dispatch(reportError(err))
        })
    })
  }
}

export function postToOxGarage(input, endpoint) {
  return dispatch => {
    dispatch(requestOddJson())
    const fd = new FormData()
    fd.append('fileToConvert', new Blob([input], {'type': 'application\/octet-stream'}), 'file.odd')
    return new Promise((res)=>{
      fetch(endpoint, {
        mode: 'cors',
        method: 'post',
        body: fd
      })
        .then(response => response.json())
        .then((json) => {
          return res(dispatch(receiveOddJson(json)))
        })
        .catch( (err) => {
          dispatch(reportError(err))
        })
    })
  }
}
