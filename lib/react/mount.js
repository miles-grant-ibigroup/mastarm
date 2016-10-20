import React from 'react'
import {render} from 'react-dom'
import {Provider} from 'react-redux'
import {browserHistory} from 'react-router'
import {syncHistoryWithStore} from 'react-router-redux'

if (process.env.NODE_ENV === 'development') {
  const Perf = window.Perf = require('react-addons-perf')
  Perf.start()
}

export default function mount ({
  id,
  router,
  store
}) {
  const history = syncHistoryWithStore(browserHistory, store)
  render(
    React.createElement(Provider, {store}, React.createElement(router, {history})),
    document.getElementById(id)
  )
}
