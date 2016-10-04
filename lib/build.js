const fs = require('fs')
const exorcist = require('exorcist')

const browserify = require('./browserify')
const transformCss = require('./cssTransform')

module.exports = function ({
  config,
  env,
  files,
  minify,
  watch
}) {
  function buildJs ([entry, outfile]) {
    const pipeline = browserify({
      config,
      entry,
      env,
      minify,
      outfile
    })

    if (watch) {
      pipeline.plugin(require('watchify'), { poll: true })
      pipeline.plugin(require('errorify'))
      pipeline.on('update', bundle)
    }

    function bundle () {
      pipeline
        .bundle()
        .pipe(exorcist(`${outfile}.map`))
        .pipe(fs.createWriteStream(outfile))
    }

    bundle()
  }

  files.map((file) => {
    if (file[1].split('.').pop() === 'css') {
      transformCss({
        filename: file[0],
        outfile: file[1],
        watch
      })
    } else {
      buildJs(file)
    }
  })
}
