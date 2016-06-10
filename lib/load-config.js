const fs = require('fs')
const path = require('path')
const YAML = require('yamljs')

module.exports = function load (cwd, config, environment) {
  const defaultDirectory = path.resolve(cwd, 'configurations/default')
  const directory = path.resolve(cwd, config || 'configurations/default')
  const env = loadYml('env')
  const settings = loadYml('settings')

  return {
    env: overrideWithEnvironment(env, environment),
    environment,
    messages: loadYml('messages'),
    path: directory,
    settings: overrideWithEnvironment(settings, environment),
    store: loadYml('store')
  }

  function loadYml (filename) {
    const defaultFile = defaultDirectory + '/' + filename + '.yml'
    const file = directory + '/' + filename + '.yml'
    if (fs.existsSync(file)) return YAML.load(file) || {}
    else if (fs.existsSync(defaultFile)) return YAML.load(defaultFile) || {}
    else return {}
  }
}

function overrideWithEnvironment (object, environment) {
  if (object.environments && object.environments[environment]) {
    const newObject = {
      ...object,
      ...object.environments[environment]
    }
    delete newObject.environments
    return newObject
  }

  return object
}
