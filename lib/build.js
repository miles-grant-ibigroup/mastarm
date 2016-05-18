var browserify = require('browserify')
var errorify = require('errorify')
var uglifyify = require('uglifyify')
var watchify = require('watchify')

var transform = require('./transform')

module.exports = function (entry, config, isDevelopment) {
  const pipeline = browserify(entry, {
    cache: {},
    debug: isDevelopment,
    packageCache: {},
    paths: [
      __dirname + '/../node_modules',
      process.cwd() + '/node_modules'
    ],
    transform: transform(config, isDevelopment)
  })
  .on('error', function (err) {
    console.error(err.message)
    console.error(err.stack)
    process.exit(0)
  })
  .on('log', function (ids) {
    console.log(ids)
  })

  if (isDevelopment) {
    pipeline.plugin(watchify)
    pipeline.plugin(errorify)
  } else {
    pipeline.transform({ global: true }, uglifyify)
  }

  return pipeline.bundle()
}
