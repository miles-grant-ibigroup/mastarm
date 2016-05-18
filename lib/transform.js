var babelify = require('babelify')
var envify = require('envify/custom')
var fs = require('fs')
var markdown = require('browserify-markdown')
var mimeType = require('mime')
var path = require('path')
var postcss = require('postcss')
var through = require('through2')
var YAML = require('yamljs')

module.exports = function transform (config, isDevelopment) {
  var babelifyConfig = {
    presets: [
      require('babel-preset-es2015'),
      require('babel-preset-react'),
      require('babel-preset-stage-0')
    ],
    plugins: [
      require('babel-plugin-add-module-exports'),
      require('babel-plugin-transform-runtime')
    ]
  }
  var env = process.env.NODE_ENV || 'development'
  var defaultEnvify = Object.assign(process.env, {
    _: 'purge',
    MESSAGES: JSON.stringify(config.messages),
    NODE_ENV: env,
    SETTINGS: JSON.stringify(config.settings),
    STORE: JSON.stringify(config.store)
  }, config.env)

  return [
    envify(defaultEnvify),
    cssTransform(postcss([
      require('postcss-import')({
        plugins: [
          base64ify(process.cwd())
        ]
      }),
      require('postcss-cssnext')(), // TODO: Creating CSS.yml variable settings to use in postcss-cssnext
      require('postcss-safe-parser'),
      require('postcss-reporter')()
    ]), isDevelopment),
    htmlTransform,
    markdown(),
    yamlTransform,
    babelify.configure(babelifyConfig)
  ]
}

function cssTransform (processor, isDevelopment) {
  return function (filename) {
    if (!/\.css$/i.test(filename)) {
      return through()
    }

    return through(function (buf, enc, next) {
      var self = this
      processor
        .process(buf.toString('utf8'), {
          map: isDevelopment
        })
        .then(function (results) {
          self.push('require(\'inject-css\')(' + JSON.stringify(results.css) + ')')
          next()
        })
        .catch(function (err) {
          console.error(err.stack)
          process.exit(1)
        })
    })
  }
}

function htmlTransform (filename) {
  if (!/\.html$/i.test(filename)) {
    return through()
  }

  return through(function (buf, enc, next) {
    var html = buf.toString('utf8')
    this.push('module.exports=' + JSON.stringify(html))
    next()
  })
}

function yamlTransform (filename) {
  if (!/\.yml|\.yaml$/i.test(filename)) {
    return through()
  }

  return through(function (buf, enc, next) {
    this.push('module.exports=' + JSON.stringify(YAML.parse(buf.toString('utf8'))) + ';')
    next()
  })
}

function getUrl (value) {
  var reg = /url\((\s*)(['"]?)(.+?)\2(\s*)\)/g
  var match = reg.exec(value)
  var url = match[3]
  return url
}

var base64ify = postcss.plugin('postcss-base64ify', function () {
  return function (css, result) {
    var source = css.source.input.file
    var dir = path.dirname(source)
    css.replaceValues(/url\((\s*)(['"]?)(.+?)\2(\s*)\)/g, function (string) {
      var filename = getUrl(string)
        .split('?')[0]
        .split('#')[0]
      var file
      if (filename.indexOf('data') === 0 || filename.length === 0) {
        return string
      } else if (filename[0] === '/') {
        file = path.join(process.cwd(), filename)
      } else {
        file = path.resolve(dir, filename)
      }
      if (!fs.existsSync(file)) {
        throw new Error('File', file, 'does not exist')
      }
      var buffer = fs.readFileSync(file)
      return 'url("data:' + mimeType.lookup(filename) + ';base64,' + buffer.toString('base64') + '")'
    })
  }
})
