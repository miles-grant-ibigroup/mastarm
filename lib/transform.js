const babelify = require('babelify')
const envify = require('envify/custom')
const fs = require('fs')
const markdown = require('browserify-markdown')
const mimeType = require('mime')
const mkdirp = require('mkdirp')
const path = require('path')
const postcss = require('postcss')
const through = require('through2')
const YAML = require('yamljs')

const babelifyConfig = {
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

module.exports = function transform ({
  config,
  env,
  outfile
}) {
  mkdirp.sync(path.dirname(outfile))

  const defaultEnvify = Object.assign(process.env, {
    _: 'purge',
    CONFIG_PATH: config.path,
    MESSAGES: JSON.stringify(config.messages),
    NODE_ENV: env,
    SETTINGS: JSON.stringify(config.settings),
    STORE: JSON.stringify(config.store)
  }, config.env)

  return [
    cssTransform({
      configPath: config.path,
      cwd: process.cwd(),
      outfile
    }),
    htmlTransform,
    markdown,
    yamlTransform,
    babelify.configure(babelifyConfig),
    envify(defaultEnvify) // Envify needs to happen last...
  ]
}

function cssTransform ({
  configPath,
  cwd,
  outfile
}) {
  return function (filename) {
    if (!/\.css$/i.test(filename)) {
      return through()
    }

    const processor = postcss([
      require('postcss-import')({
        plugins: [
          base64ify(cwd) // inline all url files
        ],
        onImport: (sources) => {
          sources.forEach((source) => stream.emit('file', source))
        }
      }),
      require('postcss-cssnext')(), // TODO: Creating CSS.yml variable settings to use in postcss-cssnext
      require('postcss-safe-parser'),
      require('postcss-reporter')({ clearMessages: true })
    ])

    const stream = through(function (buf, enc, next) {
      const self = this
      const css = buf.toString('utf8')
      processor
        .process(css.replace(/CONFIG_PATH/g, configPath), {
          map: true,
          to: `${path.basename(outfile, '.js')}.css`
        })
        .then(function (results) {
          const csspath = outfile.replace('.js', '.css')
          fs.writeFile(csspath, results.css, function (err) {
            if (err) {
              console.error(err.stack)
            }
          })
          if (results.map) {
            fs.writeFile(`${csspath}.map`, results.map, function (err) {
              if (err) {
                console.error(err.stack)
              }
            })
          }
          self.push('// css was here')
          next()
        })
        .catch(function (err) {
          console.error(err.stack)
          process.exit(1)
        })
    })

    return stream
  }
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

function getUrl (value) {
  const reg = /url\((\s*)(['"]?)(.+?)\2(\s*)\)/g
  const match = reg.exec(value)
  const url = match[3]
  return url
}

const base64ify = postcss.plugin('postcss-base64ify', function () {
  return function (css, result) {
    const source = css.source.input.file
    const dir = path.dirname(source)
    css.replaceValues(/url\((\s*)(['"]?)(.+?)\2(\s*)\)/g, function (string) {
      const filename = getUrl(string)
        .split('?')[0]
        .split('#')[0]
      let file
      if (filename.indexOf('data') === 0 || filename.length === 0) {
        return string
      } else if (filename[0] === '/') {
        file = path.join(process.cwd(), filename)
      } else {
        file = path.resolve(dir, filename)
      }
      if (!fs.existsSync(file)) {
        throw new Error(`File ${file} does not exist`)
      }
      const buffer = fs.readFileSync(file)
      return 'url("data:' + mimeType.lookup(filename) + ';base64,' + buffer.toString('base64') + '")'
    })
  }
})
