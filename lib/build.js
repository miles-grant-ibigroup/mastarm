const fs = require('fs')
const exorcist = require('exorcist')

const browserify = require('./browserify')

module.exports = function ({
  config,
  env,
  minify,
  watch
}) {
  return function ([entry, outfile]) {
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
}
