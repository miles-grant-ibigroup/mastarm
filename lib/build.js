var browserify = require('browserify')
var transform = require('./transform')

module.exports = function (entry, config, isDevelopment) {
  const pipeline = browserify(entry, {
    debug: isDevelopment,
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

  if (!isDevelopment) pipeline.transform({ global: true }, require('uglifyify'))

  return pipeline.bundle()
}
