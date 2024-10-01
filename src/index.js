import './scss/romajs.scss'

import 'babel-polyfill'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import thunkMiddleware from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'
// import { routerMiddleware, ConnectedRouter } from 'react-router-redux'
import { routerMiddleware, ConnectedRouter, connectRouter } from 'connected-react-router'
import createHistory from 'history/createBrowserHistory'
import { persistStore, persistCombineReducers } from 'redux-persist'
/* import storage from 'redux-persist/es/storage' */
import localForage from './localForageConfig'
import { PersistGate } from 'redux-persist/es/integration/react'
import reducers from './reducers'
import App from './components/App'

if (module.hot) {
  module.hot.accept()
}

const romajsElement = document.getElementById('romajs')
const basename = romajsElement.getAttribute('data-basename')

const history = createHistory({ basename })

const persistConf = {
  key: 'root',
  storage: localForage,
  blacklist: ['router']
}

const router = {router: connectRouter(history)}

const romajsApp = persistCombineReducers(persistConf, Object.assign(reducers, router))
let store

if (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})

  const enhancer = composeEnhancers(
    applyMiddleware(
      routerMiddleware(history),
      thunkMiddleware
    )
  )
  store = createStore(romajsApp, enhancer)
} else {
  store = createStore(
    romajsApp,
    applyMiddleware(
      routerMiddleware(history),
      thunkMiddleware
    )
  )
}

const persistor = persistStore(store)

render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <ConnectedRouter history={history}>
        <App/>
      </ConnectedRouter>
    </PersistGate>
  </Provider>,
  romajsElement
)
