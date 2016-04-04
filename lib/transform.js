var babelify = require('babelify')
var browserifyCss = require('browserify-css')
var envify = require('envify/custom')

module.exports = function transform (config) {
  var babelifyConfig = {
    presets: [
      require('babel-preset-es2015'),
      require('babel-preset-react'),
      require('babel-preset-stage-0')
    ],
    plugins: [
      require('babel-plugin-add-module-exports'),
      require('babel-plugin-transform-runtime')
    ]
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
