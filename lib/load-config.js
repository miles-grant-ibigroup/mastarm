var fs = require('fs')
var path = require('path')
var YAML = require('yamljs')

module.exports = function load (cwd, config, environment) {
  var defaultDirectory = path.resolve(cwd, 'configurations/default')
  var directory = path.resolve(cwd, config || 'configurations/default')

  var settings = loadYml('settings')
  if (settings.environments && settings.environments[environment]) {
    settings = Object.assign({}, settings, settings.environments[environment]) // Override settings based on environment
    delete settings.environments
  }

  return {
    env: loadYml('env'),
    messages: loadYml('messages'),
    path: directory,
    settings: settings,
    store: loadYml('store')
  }

  function loadYml (filename) {
    var defaultFile = defaultDirectory + '/' + filename + '.yml'
    var file = directory + '/' + filename + '.yml'
    if (fs.existsSync(file)) return YAML.load(file) || {}
    else if (fs.existsSync(defaultFile)) return YAML.load(defaultFile) || {}
    else return {}
  }
}
