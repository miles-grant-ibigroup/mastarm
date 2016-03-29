var babelify = require('babelify')
var browserifyCss = require('browserify-css')
var envify = require('envify/custom')

module.exports = function transform (config) {
  var babelifyConfig = {
    presets: ['es2015', 'react', 'stage-0'],
    plugins: ['add-module-exports', 'transform-runtime']
  }

  var defaultEnvify = {
    _: 'purge',
    MESSAGES: config.messages,
    NODE_ENV: process.env.NODE_ENV || 'development',
    SETTINGS: config.settings,
    STORE: config.store
  }

  return [
    [browserifyCss, {
      global: true,
      minify: process.env.NODE_ENV === 'production'
    }],
    babelify.configure(babelifyConfig),
    envify(Object.assign(defaultEnvify, config.env))
  ]
}
