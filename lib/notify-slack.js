const Slack = require('slack-node')
const slack = new Slack()

module.exports = function notify ({
  channel,
  text,
  webhook
}) {
  return new Promise((resolve, reject) => {
    try {
      slack.setWebhook(webhook)
      slack.webhook({channel, text}, (err, response) => {
        if (err) onError(err)
        else resolve(response)
      })
    } catch (err) {
      onError(err)
    }

    function onError (err) {
      console.log(text)
      console.error('Error posting to Slack webhook')
      console.error(err)
      resolve(err) // Always resolve to avoid logging to cause failure
    }
  })
}
