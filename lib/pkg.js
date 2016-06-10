const fs = require('fs')
const path = require('path')
const pkgPath = path.resolve(process.cwd(), 'package.json')
if (fs.existsSync(pkgPath)) {
  module.exports = require(pkgPath)
} else {
  module.exports = {}
}
