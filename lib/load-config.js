var fs = require('fs')
var path = require('path')
var YAML = require('yamljs')

module.exports = function load (cwd, config) {
  var defaultDirectory = path.resolve(cwd, 'configurations/default')
  var directory = path.resolve(cwd, config || 'configurations/default')

  return {
    env: loadYml('env'),
    message: loadYml('messages'),
    settings: loadYml('settings'),
    store: loadYml('store')
  }

  function loadYml (filename) {
    var defaultFile = defaultDirectory + '/' + filename + '.yml'
    var file = directory + '/' + filename + '.yml'
    if (fs.existsSync(file)) return YAML.load(file)
    else if (fs.existsSync(defaultFile)) return YAML.load(defaultFile)
    else return {}
  }
}
