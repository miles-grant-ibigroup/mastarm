const browserify = require('browserify')
const path = require('path')
const uglifyify = require('uglifyify')

const transform = require('./js-transform')

module.exports = browserifyIt

function browserifyIt ({
  config,
  entry,
  env,
  minify
}) {
  return browserify(entry, {
    basedir: process.cwd(),
    cache: {},
    debug: true,
    fullPaths: env === 'development',
    packageCache: {},
    paths: [
      path.join(__dirname, '/../node_modules'),
      path.join(process.cwd(), '/node_modules')
    ],
    transform: transform({config, env})
  })
}

module.exports.minify = function (opts) {
  const pipeline = browserifyIt(opts)
  pipeline.transform(uglifyify, {global: true})
  return pipeline
}
