const slack = require('./notify-slack')

module.exports = ({channel = '#devops', webhook}) => (text) => {
  if (webhook) {
    slack({channel, text, webhook})
  }
  console.log(text)
}
