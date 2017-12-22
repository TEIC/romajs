import './scss/romajs.scss'

import 'babel-polyfill'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import thunkMiddleware from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'
import { routerMiddleware, ConnectedRouter } from 'react-router-redux'
import createHistory from 'history/createBrowserHistory'
import { persistStore, persistCombineReducers } from 'redux-persist'
import storage from 'redux-persist/es/storage'
import { PersistGate } from 'redux-persist/es/integration/react'
import reducers from './reducers'
import App from './components/App'

if (module.hot) {
  module.hot.accept()
}

// const history = createHistory({ basename: '/romajs' })
const history = createHistory()

const persistConf = {
  key: 'root',
  storage
}

const romajsApp = persistCombineReducers(persistConf, reducers)
const store = createStore(
  romajsApp,
  applyMiddleware(
    routerMiddleware(history),
    thunkMiddleware
  )
)

const persistor = persistStore(store)

render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <ConnectedRouter history={history}>
        <App/>
      </ConnectedRouter>
    </PersistGate>
  </Provider>,
  document.getElementById('romajs')
)
