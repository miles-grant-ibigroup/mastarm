const path = require('path')

const buildCss = require('./css-transform')
const buildJs = require('./js-build')

/**
 * Takes a configuration object, array of file entries [entry, output], and other options.
 *
 * @return [Promise] array of Promises
 */

module.exports = function ({ config, env, files, instrument, minify, watch }) {
  return Promise.all(
    files.map(
      ([entry, outfile]) =>
        path.extname(entry) === '.css'
          ? buildCss({ config, entry, minify, outfile, watch })
          : buildJs({ config, entry, env, instrument, minify, outfile, watch })
    )
  )
}
