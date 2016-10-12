const babelify = require('babelify')
const envify = require('envify/custom')
const markdown = require('browserify-markdown')
const through = require('through2')
const YAML = require('yamljs')

const babelifyConfig = require('./babel-config')

module.exports = function transform ({
  config,
  env
}) {
  const defaultEnvify = Object.assign(process.env, {
    _: 'purge',
    CONFIG_PATH: config.path,
    MESSAGES: JSON.stringify(config.messages),
    NODE_ENV: env,
    SETTINGS: JSON.stringify(config.settings),
    STORE: JSON.stringify(config.store)
  }, config.env)

  return [
    htmlTransform,
    markdown({
      html: true
    }),
    yamlTransform,
    babelify.configure(babelifyConfig),
    envify(defaultEnvify) // Envify needs to happen last...
  ]
}

function htmlTransform (filename) {
  if (!/\.html$/i.test(filename)) {
    return through()
  }

  return through(function (buf, enc, next) {
    this.push('module.exports=' + JSON.stringify(buf.toString('utf8')))
    next()
  })
}

function yamlTransform (filename) {
  if (!/\.yml|\.yaml$/i.test(filename)) {
    return through()
  }

  return through(function (buf, enc, next) {
    this.push('module.exports=' + JSON.stringify(YAML.parse(buf.toString('utf8'))))
    next()
  })
}
