import merge from 'lodash.merge'
import {combineReducers} from 'redux'
import {routerReducer as router} from 'react-router-redux'

let configureStore = null
if (process.env.NODE_ENV === 'production') {
  configureStore = require('./store.production')
} else {
  configureStore = require('./store.development')
}

export default function createStore (reducers) {
  return configureStore(
    merge(
      safeParse(process.env.STORE),
      safeParse(window.localStorage ? window.localStorage.getItem('state') : {})
    ),
    combineReducers({router, ...reducers})
  )
}

function safeParse (str) {
  try {
    return JSON.parse(str) || {}
  } catch (e) {
    return {}
  }
}
