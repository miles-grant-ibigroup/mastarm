const fs = require('fs')
const exorcist = require('exorcist')
const mkdirp = require('mkdirp')
const path = require('path')

const browserify = require('./browserify')
const logger = require('./logger')

/**
 *
 * @return Promise
 */

module.exports = function buildJs ({
  config,
  entry,
  env,
  minify,
  outfile,
  watch
}) {
  const pipeline = minify
    ? browserify.minify({ config, entry, env })
    : browserify({ config, entry, env })
  const bundle = () =>
    new Promise((resolve, reject) => {
      if (outfile) {
        mkdirp.sync(path.dirname(outfile))
        pipeline
          .bundle()
          .pipe(exorcist(`${outfile}.map`))
          .pipe(fs.createWriteStream(outfile))
          .on('error', reject)
          .on('finish', resolve)
      } else {
        pipeline.bundle((err, buf) => {
          if (err) reject(err)
          else resolve(buf)
        })
      }
    })

  if (watch) {
    pipeline.plugin(require('watchify'), { poll: true })
    pipeline.plugin(require('errorify'))
    pipeline.on('update', bundle)
    pipeline.on('log', logger.log)
  }

  return bundle()
}
