const browserify = require('browserify')
const path = require('path')
const uglifyify = require('uglifyify')

const transform = require('./transform')

module.exports = function ({
  config,
  debug,
  entry,
  env,
  outfile
}) {
  var pipeline = browserify(entry, {
    cache: {},
    debug,
    packageCache: {},
    paths: [
      path.join(__dirname, '/../node_modules'),
      path.join(process.cwd(), '/node_modules')
    ],
    transform: transform({
      config,
      debug,
      env,
      outfile
    })
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
