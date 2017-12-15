// @flow
const babelify = require('babelify')
const envify = require('envify/custom')
const markdown = require('browserify-markdown')
const through = require('through2')
const YAML = require('yamljs')

const babelConfig = require('./babel-config')

module.exports = function transform ({ config, env }) {
  const envvars = Object.assign(
    {},
    process.env,
    {
      CONFIG_PATH: config.path,
      MESSAGES: JSON.stringify(config.messages),
      NODE_ENV: env,
      SETTINGS: JSON.stringify(config.settings),
      STORE: JSON.stringify(config.store)
    },
    config.env
  )

  return [
    svgToString,
    imagesToBase64String,
    htmlTransform,
    markdown({
      html: true
    }),
    yamlTransform,
    babelify.configure(babelConfig(env)),
    [envify(envvars), { global: true }] // Envify needs to happen last...
  ]
}

function svgToString (filename) {
  if (!/\.svg$/i.test(filename)) {
    return through()
  }

  return through(function (buf, enc, next) {
    this.push('module.exports=' + JSON.stringify(buf.toString('utf8')))
    next()
  })
}

function imagesToBase64String (filename) {
  if (!/\.png|\.jpg|\.jpeg|\.gif$/i.test(filename)) {
    return through()
  }

  return through(function (buf, enc, next) {
    this.push('module.exports=' + JSON.stringify(buf.toString('base64')))
    next()
  })
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
    this.push(
      'module.exports=' + JSON.stringify(YAML.parse(buf.toString('utf8')))
    )
    next()
  })
}
