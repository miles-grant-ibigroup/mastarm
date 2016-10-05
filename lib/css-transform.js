const fs = require('fs')
const path = require('path')

const chokidar = require('chokidar')
const mimeType = require('mime')
const postcss = require('postcss')

module.exports = function ({
  filename,
  outfile,
  watch
}) {
  if (!/\.css$/i.test(filename)) { return }

  let watcher

  const transform = () => {
    postcss([
      require('postcss-import')({
        plugins: [
          base64ify(process.cwd()) // inline all url files
        ],
        onImport: (sources) => {
          if (watch) {
            sources.forEach((source) => {
              watcher.add(source)
            })
          }
        }
      }),
      require('postcss-cssnext')(),
      require('postcss-safe-parser'),
      require('postcss-reporter')({ clearMessages: true })
    ])
      .process(fs.readFileSync(filename, 'utf8'), {
        map: true,
        to: `${path.basename(outfile, '.js')}.css`
      })
      .then(function (results) {
        fs.writeFileSync(outfile, results.css)
        if (results.map) {
          fs.writeFile(`${outfile}.map`, results.map, handleErr)
        }
      })
      .catch(function (err) {
        console.error(err.stack)
        process.exit(1)
      })
  }

  if (watch) {
    watcher = chokidar.watch(filename)
    watcher.on('add', transform)
      .on('change', transform)
      .on('unlink', transform)
  }

  transform()
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

function getUrl (value) {
  const reg = /url\((\s*)(['"]?)(.+?)\2(\s*)\)/g
  const match = reg.exec(value)
  const url = match[3]
  return url
}

function handleErr (err) {
  if (err) {
    console.error(err.stack)
  }
}
