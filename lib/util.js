const pkg = require('../lib/pkg')

exports.getCssFiles = (options) => {
  let files = []
  if (options.css) {
    if (options.cssFiles) {
      files = files.concat(options.cssFiles.split(' '))
    } else {
      files.push('lib/styles.css:assets/index.css')
    }
  }
  return files
}

exports.makeGetFn = (targets) => {
  return (item) => {
    const ts = targets.filter((t) => t[item] !== undefined)
    if (ts.length > 0) return ts[0][item]
  }
}

exports.parseEntries = function (entries, get) {
  const files = entries.map((entry) => {
    entry = entry.split(':')
    if (entry.length === 1) {
      entry.push(`assets/${entry[0]}`)
    }
    return entry
  })

  if (files.length === 0) {
    files.push([
      get('entry') || pkg.main || 'index.js',
      get('outfile') || 'assets/index.js'
    ])
  }

  return files
}

/**
 * A lot of subcommands utilize exact argument lengths. Pop mastarm to handle it.
 */
exports.popMastarmFromArgv = function () {
  process.argv = process.argv.slice(0, 1).concat(process.argv.slice(2))
}

exports.updateDependencies = function () {
  const checkDependenciesSync = require('check-dependencies').sync
  const results = checkDependenciesSync({
    install: true,
    packageDir: process.cwd()
  })
  if (results.status !== 0) {
    console.error(results.error)
    process.exit(results.status)
  } else if (!results.depsWereOk) {
    console.log('Updated out of date dependencies found in package.json. Please try running the command again.')
    process.exit(results.status)
  }
}
