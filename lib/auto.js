var argv = require('minimist')(process.argv.slice(2))
var loadConfig = require('./load-config')
var pkg = require('./pkg')

module.exports = function () {
  const env = argv.env || process.env.NODE_ENV
  const config = loadConfig(process.cwd(), argv.config, env)
  const get = (item, backup) => argv[item] || config.settings[item] || backup
  return {
    argv,
    config,
    debug: argv.debug || env === 'development',
    env,
    entry: argv._[0] || config.settings.entry || pkg.main,
    get,
    outfile: argv._[1] || config.settings.outfile || 'assets/index.js',
    pkg: pkg
  }
}
