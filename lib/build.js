const fs = require('fs')
const exorcist = require('exorcist')

const browserify = require('./browserify')
const transformCss = require('./cssTransform')
const util = require('./util')

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

  function buildCss ([filename, outfile]) {
    transformCss({
      filename,
      outfile
    })
  }

  const organizedFiles = util.separateCssFiles(files)

  organizedFiles.css.forEach(buildCss)
  organizedFiles.notCss.forEach(buildJs)
}
