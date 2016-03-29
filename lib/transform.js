var babelify = require('babelify')
var envify = require('envify/custom')

module.exports = function transform (config) {
  var babelifyConfig = {
    presets: ['es2015', 'react', 'stage-0'],
    plugins: ['transform-runtime'],
    env: {
      development: {
        plugins: [['react-transform', {
          transforms: [{
            transform: 'react-transform-catch-errors',
            imports: ['react', 'redbox-react']
          }, {
            transform: 'react-transform-render-visualizer'
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
    ['browserify-css', {
      global: true,
      minify: process.env.NODE_ENV === 'production'
    }],
    babelify.configure(babelifyConfig),
    envify(Object.assign(defaultEnvify, config.env))
  ]
}
