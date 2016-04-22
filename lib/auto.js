var argv = require('minimist')(process.argv.slice(2))
var loadConfig = require('./load-config')
var pkg = require('./pkg')

module.exports = function () {
  var config = loadConfig(process.cwd(), argv.config)
  return {
    config: config,
    entry: argv._[0] || config.settings.entry || pkg.main,
    pkg: pkg
  }
}
