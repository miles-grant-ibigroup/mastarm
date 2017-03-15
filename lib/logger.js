const nodeEmoji = require('node-emoji')
const slack = require('./notify-slack')

module.exports = function ({channel, webhook} = {}) {
  if (webhook) console.log(`see slack@${channel} for notifications`)
  return function (text) {
    if (webhook) {
      return slack({channel, text, webhook})
    } else {
      const strippedLinks = text.replace(/<[^|>]+\|([^>]+)>/g, '$1')
      return Promise.resolve(console.log(nodeEmoji.emojify(strippedLinks)))
    }
  }
}
