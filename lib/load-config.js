// @flow
const fs = require('fs')
const path = require('path')
const YAML = require('yamljs')

module.exports = function load (cwd, config, environment) {
  const configDirectory = path.resolve(cwd, config || 'configurations/default')
  const defaultDirectory = path.resolve(cwd, 'configurations/default')
  const env = loadYaml('env')
  const settings = loadYaml('settings')

  if (environment === 'production') {
    process.env.NODE_ENV = 'production'
  }

  return {
    env: overrideWithEnvironment(env, environment),
    environment,
    messages: loadYaml('messages'),
    path: configDirectory,
    settings: overrideWithEnvironment(settings, environment),
    store: loadYaml('store'),
    stylePath: findFile('style.css')
  }

  function findFile (filename) {
    const file = configDirectory + '/' + filename
    if (fs.existsSync(file)) return file
    const defaultFile = defaultDirectory + '/' + filename
    if (fs.existsSync(defaultFile)) return defaultFile
    return null
  }

  function loadYaml (filename) {
    const file = findFile(`${filename}.yml`)
    return file ? YAML.parse(fs.readFileSync(file, 'utf8')) : {}
  }
}

function overrideWithEnvironment (object, environment) {
  if (object.environments && object.environments[environment]) {
    const newObject = Object.assign(
      {},
      object,
      object.environments[environment]
    )
    delete newObject.environments
    return newObject
  }

  return object
}
