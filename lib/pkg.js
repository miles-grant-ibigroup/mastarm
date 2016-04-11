var fs = require('fs')
var path = require('path')
var pkgPath = path.resolve(process.cwd(), 'package.json')
if (fs.existsSync(pkgPath)) {
  module.exports = require(pkgPath)
} else {
  module.exports = {}
}
