import React from 'react';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import { StaticRouter } from 'react-router-dom/server';
import { routerMiddleware, ConnectedRouter, connectRouter } from 'connected-react-router';
import { persistStore, persistCombineReducers } from 'redux-persist';
import localForage from './localForageConfig';
import { PersistGate } from 'redux-persist/integration/react';
import reducers from './reducers';
import App from './components/App';
import createHistory from 'history/createMemoryHistory';

const persistConf = {
  key: 'root',
  storage: localForage,
  blacklist: ['router'],
};

export async function render(url, context) {
  const history = createHistory();
  const router = { router: connectRouter(history) };
  const romajsApp = persistCombineReducers(persistConf, Object.assign(reducers, router));
  const store = createStore(romajsApp, applyMiddleware(routerMiddleware(history), thunkMiddleware));
  const persistor = persistStore(store);

  const appHtml = renderToString(
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <StaticRouter location={url} context={context}>
          <ConnectedRouter history={history}>
            <App />
          </ConnectedRouter>
        </StaticRouter>
      </PersistGate>
    </Provider>
  );

  return appHtml;
}
