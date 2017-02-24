const Slack = require('slack-node')
const slack = new Slack()

module.exports = function notify ({
  channel,
  text,
  webhook
}) {
  return new Promise((resolve, reject) => {
    slack.setWebhook(webhook)
    slack.webhook({channel, text}, (err, response) => {
      if (err) reject(err)
      else resolve(response)
    })
  })
}
