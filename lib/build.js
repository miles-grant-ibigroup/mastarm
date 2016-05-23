var browserify = require('browserify')
var uglifyify = require('uglifyify')

var transform = require('./transform')

module.exports = function (entry, config, debug, env) {
  var pipeline = browserify(entry, {
    cache: {},
    debug: debug,
    packageCache: {},
    paths: [
      __dirname + '/../node_modules',
      process.cwd() + '/node_modules'
    ],
    transform: transform(config, debug, env)
  })
  .on('error', function (err) {
    console.error(err.message)
    console.error(err.stack)
    process.exit(0)
  })
  .on('log', function (message) {
    console.log(message)
  })

  if (!debug) {
    pipeline.transform({ global: true }, uglifyify)
  }

  return pipeline
}
