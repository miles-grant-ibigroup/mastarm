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

  var defaultEnvify = Object.assign(process.env, {
    _: 'purge',
    MESSAGES: JSON.stringify(config.messages),
    NODE_ENV: process.env.NODE_ENV || 'development',
    SETTINGS: JSON.stringify(config.settings),
    STORE: JSON.stringify(config.store)
  }, config.env)

  return [
    [browserifyCss, {
      global: true,
      minify: process.env.NODE_ENV === 'production'
    }],
    babelify.configure(babelifyConfig),
    envify(defaultEnvify)
  ]
}
