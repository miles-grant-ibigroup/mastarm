var babelify = require('babelify')
var envify = require('envify/custom')
var fs = require('fs')
var path = require('path')
var YAML = require('yamljs')

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
  var defaultDirectory = path.resolve(process.cwd(), 'configurations/default')
  var directory = path.resolve(process.cwd(), config || 'configurations/default')
  var defaultEnvify = {
    _: 'purge',
    MESSAGES: loadYml('messages'),
    NODE_ENV: process.env.NODE_ENV || 'development',
    SETTINGS: loadYml('settings'),
    STORE: loadYml('store')
  }

  return [
    ['browserify-css', {
      global: true,
      minify: process.env.NODE_ENV === 'production'
    }],
    babelify.configure(babelifyConfig),
    envify(Object.assign(defaultEnvify, loadYml('env')))
  ]

  function loadYml (filename) {
    var defaultFile = defaultDirectory + '/' + filename + '.yml'
    var file = directory + '/' + filename + '.yml'
    if (fs.existsSync(file)) return YAML.load(file)
    else if (fs.existsSync(defaultFile)) return YAML.load(defaultFile)
    else return {}
  }
}
