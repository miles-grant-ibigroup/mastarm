const fs = require('fs')
const path = require('path')

const babel = require('@babel/core')
const glob = require('glob')
const mkdirp = require('mkdirp')

const babelConfig = require('./babel-config')

module.exports = function ({ entries, env, outdir }) {
  return (
    entries
      .reduce((results, entry) => {
        if (fs.statSync(entry[0]).isDirectory()) {
          return [
            ...results,
            ...transformDir({ config: babelConfig(env), entry, outdir })
          ]
        } else {
          return [
            ...results,
            transformFile({ config: babelConfig(env), entry, outdir })
          ]
        }
      }, [])
      // Remove the skipped files we set to undefined
      .filter((result) => result !== undefined)
  )
}

/**
 * Transform all of the files in a directory recursively.
 */
function transformDir({ config, entry, outdir }) {
  return glob.sync(`${entry[0]}/**/*.{js,jsx,ts,tsx}`).map((filename) =>
    transformFile({
      config,
      entry: [filename, filename.replace(entry[0], entry[1] || outdir)]
    })
  )
}

/**
 * Transform a file with babel and also write the sourcemap for the file.
 */
function transformFile({ config, entry, outdir }) {
  const filename = entry[0]
  const filepath = entry[1] || `${outdir}/${filename}`
  const results = babel.transform(
    fs.readFileSync(filename, 'utf8'),
    Object.assign({}, config, { filename, sourceMaps: true })
  )
  mkdirp.sync(path.dirname(filepath))

  // Files ignored by babel will set results to null
  if (!results) {
    return
  }

  // TODO: is there a cleaner way to ensure output is js? Doesn't seem
  // like babel does this outside the cli
  const transpiledFilePath = filepath.replace('.ts', '.js')

  fs.writeFileSync(
    transpiledFilePath,
    results.code +
      '\n\n//# sourceMappingURL=' +
      path.basename(transpiledFilePath)
  )
  fs.writeFileSync(`${transpiledFilePath}.map`, JSON.stringify(results.map))

  return results
}
