const fetch = require('isomorphic-fetch')
const nodeEmoji = require('node-emoji')

const logToConsole = text => Promise.resolve(console.log(emojify(text)))
const logToErrorConsole = text => Promise.resolve(console.error(emojify(text)))

module.exports.log = logToConsole
module.exports.error = logToErrorConsole

module.exports.logToSlack = ({ channel, webhook }) => {
  module.exports.log = text => {
    logToConsole(text)
    return notifySlack({ channel, text, webhook })
  }

  module.exports.error = text => {
    logToErrorConsole(text)
    return notifySlack({ channel, text, webhook })
  }
}

/**
 * Emojify text outside of html
 */
function emojify (text) {
  const strippedLinks = text.replace(/<[^|>]+\|([^>]+)>/g, '$1')
  return nodeEmoji.emojify(strippedLinks)
}

/**
 * Send a message to slack by making a request to a webhook.
 */
function notifySlack ({ channel, text, webhook }) {
  return fetch(webhook, {
    body: JSON.stringify({
      channel,
      text
    }),
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST'
  })
    .then(response => response.text())
    .catch(err => {
      logToErrorConsole('Error posting to Slack webhook')
      logToErrorConsole(err)
      return err
    })
}

/**
 * Send a message to MS Teams using a webhook. This will generate a card
 * according to the following schema:
 * https://docs.microsoft.com/en-us/outlook/actionable-messages/message-card-reference#openuri-action
 *
 * @param  {Array} potentialAction  An array of potential actions on a card.
 * @param  {String} text  The card body text
 * @param  {String} [themeColor='0072C6'] Card theme color
 * @param  {String} title  Title of the card
 * @param  {String} webhook  Webhook url
 */
module.exports.notifyMsTeams = function notifyMSTeams ({
  potentialAction,
  text,
  themeColor = '0072C6',
  title,
  webhook
}) {
  return fetch(
    webhook,
    {
      method: 'POST',
      body: JSON.stringify({
        '@context': 'https://schema.org/extensions',
        '@type': 'MessageCard',
        themeColor,
        title,
        text,
        potentialAction
      })
    }
  )
}
