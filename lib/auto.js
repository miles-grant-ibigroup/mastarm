var argv = require('minimist')(process.argv.slice(2))
var loadConfig = require('./load-config')
var pkg = require('./pkg')

module.exports = function () {
  var env = argv.env || process.env.NODE_ENV
  var config = loadConfig(process.cwd(), argv.config, env)
  return {
    argv: argv,
    config: config,
    env: env,
    entry: argv._[0] || config.settings.entry || pkg.main,
    outfile: argv._[1] || config.settings.outfile || 'assets/index.js',
    pkg: pkg
  }
}
