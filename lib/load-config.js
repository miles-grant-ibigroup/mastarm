const fs = require('fs')
const path = require('path')
const YAML = require('yamljs')

module.exports = function load (cwd, config, environment) {
  const defaultDirectory = path.resolve(cwd, 'configurations/default')
  const directory = path.resolve(cwd, config || 'configurations/default')
  const env = YAML.parse(loadFile('env.yml')) || {}
  const settings = YAML.parse(loadFile('settings.yml')) || {}

  return {
    env: overrideWithEnvironment(env, environment),
    environment,
    messages: YAML.parse(loadFile('messages.yml')) || {},
    path: directory,
    settings: overrideWithEnvironment(settings, environment),
    store: YAML.parse(loadFile('store.yml')) || {},
    style: loadFile('style.css')
  }

  function loadFile (filename) {
    const defaultFile = defaultDirectory + '/' + filename
    const file = directory + '/' + filename
    if (fs.existsSync(file)) return fs.readFileSync(file, 'utf8')
    else if (fs.existsSync(defaultFile)) return fs.readFileSync(defaultFile, 'utf8')
    else return ''
  }
}

function overrideWithEnvironment (object, environment) {
  if (object.environments && object.environments[environment]) {
    const newObject = Object.assign({}, object, object.environments[environment])
    delete newObject.environments
    return newObject
  }

  return object
}
