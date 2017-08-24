import './scss/romajs.scss'

import 'babel-polyfill'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import thunkMiddleware from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'
import romajsApp from './reducers'
import App from './containers/App'

const store = createStore(
  romajsApp,
  applyMiddleware(
    thunkMiddleware
  )
)

render(
  <Provider store={store}>
    <App/>
  </Provider>,
  document.getElementById('romajs')
)
