import {browserHistory} from 'react-router'
import {routerMiddleware} from 'react-router-redux'
import {applyMiddleware, createStore} from 'redux'
import createLogger from 'redux-logger'
import promise from 'redux-promise'

import {middleware as fetch} from '../fetch'
import multi from './multi'

const logger = createLogger({
  collapsed: true,
  duration: true
})

export default function configureStore (initialState, rootReducer) {
  return createStore(
    rootReducer,
    initialState,
    applyMiddleware(
      routerMiddleware(browserHistory),
      fetch,
      multi,
      promise,
      logger
    )
  )
}
