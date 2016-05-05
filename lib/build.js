var browserify = require('browserify')
var transform = require('./transform')

module.exports = function (entry, config, uglify) {
  const pipeline = browserify(entry, {
    paths: [
      __dirname + '/../node_modules',
      process.cwd() + '/node_modules'
    ],
    transform: transform(config, false)
  })

  if (uglify) pipeline.transform({ global: true }, require('uglifyify'))

  return pipeline.bundle()
}
