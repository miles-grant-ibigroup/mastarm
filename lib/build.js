var browserify = require('browserify')
var transform = require('./transform')

module.exports = function (entry, config) {
  console.log('building %s', entry)
  return browserify(entry, { transform: transform(config, false) })
    .transform({ global: true }, require('uglifyify'))
    .bundle()
}
