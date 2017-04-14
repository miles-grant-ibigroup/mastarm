const fetch = require('isomorphic-fetch')
const nodeEmoji = require('node-emoji')

const logToConsole = text => Promise.resolve(console.log(emojify(text)))
const logToErrorConsole = text => Promise.resolve(console.error(emojify(text)))

module.exports.log = logToConsole
module.exports.error = logToErrorConsole

module.exports.logToSlack = ({channel, webhook}) => {
  module.exports.log = text => {
    logToConsole(text)
    return notifySlack({channel, text, webhook})
  }

  module.exports.error = text => {
    logToErrorConsole(text)
    return notifySlack({channel, text, webhook})
  }
}

function emojify(text) {
  const strippedLinks = text.replace(/<[^|>]+\|([^>]+)>/g, '$1')
  return nodeEmoji.emojify(strippedLinks)
}

function notifySlack({channel, text, webhook}) {
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
    .then(response => response.text())
    .catch(err => {
      logToErrorConsole('Error posting to Slack webhook')
      logToErrorConsole(err)
      return err
    })
}
