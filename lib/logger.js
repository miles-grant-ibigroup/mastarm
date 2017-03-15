const nodeEmoji = require('node-emoji')
const slack = require('./notify-slack')

module.exports = function ({channel, webhook} = {}) {
  if (webhook) {
    return function (text) {
      emojifyLog(text)
      return slack({channel, text, webhook})
    }
  }
  return function (text) {
    return Promise.resolve(emojifyLog(text))
  }
}

function emojifyLog (text) {
  const strippedLinks = text.replace(/<[^|>]+\|([^>]+)>/g, '$1')
  console.log(nodeEmoji.emojify(strippedLinks))
}
