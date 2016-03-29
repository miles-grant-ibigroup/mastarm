var reactTransform = require('babel-plugin-react-transform')
var transformRuntime = require('babel-plugin-transform-runtime')
var es2015 = require('babel-preset-es2015')
var presetReact = require('babel-preset-react')
var stage0 = require('babel-preset-stage-0')
var babelify = require('babelify')
var browserifyCss = require('browserify-css')
var envify = require('envify/custom')
var react = require('react')
var reactTransformCatchErrors = require('react-transform-catch-errors')
var reactTransformRenderVisualizer = require('react-transform-render-visualizer')
var redboxReact = require('redbox-react')

module.exports = function transform (config) {
  var babelifyConfig = {
    presets: [es2015, presetReact, stage0],
    plugins: [transformRuntime],
    env: {
      development: {
        plugins: [[reactTransform, {
          transforms: [{
            transform: reactTransformCatchErrors,
            imports: [react, redboxReact]
          }, {
            transform: reactTransformRenderVisualizer
          }]
        }]]
      }
    }
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
