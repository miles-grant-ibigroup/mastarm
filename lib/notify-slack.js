const fetch = require('isomorphic-fetch')

module.exports = function notify ({
  channel,
  text,
  webhook
}) {
  return fetch(webhook, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      channel,
      text
    })
  })
  .then((response) => response.text())
  .catch((err) => {
    console.error('Error posting to Slack webhook')
    console.error(err)
    return err
  })
}
