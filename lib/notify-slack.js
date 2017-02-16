const Slack = require('slack-node')
const slack = new Slack()

module.exports = function notify ({
  channel,
  text,
  webhook
}) {
  slack.setWebhook(webhook)
  slack.webhook({channel, text}, (err, response) => {
    if (err) console.error(err)
  })
}
