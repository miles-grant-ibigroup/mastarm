const slack = require('./notify-slack')

module.exports = function ({channel, webhook} = {}) {
  if (webhook) console.log(`see slack@${channel} for notifications`)
  return function (text) {
    if (webhook) {
      return slack({channel, text, webhook})
    } else {
      return Promise.resolve(console.log(text))
    }
  }
}
