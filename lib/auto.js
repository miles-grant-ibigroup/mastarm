const argv = require('minimist')(process.argv.slice(2))
const loadConfig = require('./load-config')
const pkg = require('./pkg')

module.exports = function () {
  const env = argv.env || process.env.NODE_ENV
  const config = loadConfig(process.cwd(), argv.config, env)
  const get = (item, backup) => argv[item] || config.settings[item] || backup
  const files = argv._.map((entry) => {
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

  return {
    argv,
    config,
    debug: argv.debug || env === 'development',
    env,
    files,
    entry: argv._[0] || config.settings.entry || pkg.main,
    get,
    outfile: argv._[1] || config.settings.outfile || 'assets/index.js',
    pkg: pkg
  }
}
